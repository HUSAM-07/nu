import { NextResponse } from 'next/server';

// Maximum allowed image size (10MB)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // Add content length check
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large - maximum allowed size is 10MB' },
        { status: 413 }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type - application/json required' },
        { status: 415 }
      );
    }

    const body = await request.json();
    const { image } = body;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate image data format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format - must be a data URL' },
        { status: 400 }
      );
    }

    // Extract the base64 data from the data URL
    const parts = image.split(',');
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: 'Invalid image data URL format' },
        { status: 400 }
      );
    }
    
    const base64Image = parts[1];
    if (!base64Image || base64Image.trim() === '') {
      return NextResponse.json(
        { error: 'Empty image data' },
        { status: 400 }
      );
    }

    // Check image size after base64 extraction
    const imageSize = Buffer.from(base64Image, 'base64').length;
    if (imageSize > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Image too large - maximum allowed size is 10MB' },
        { status: 413 }
      );
    }
    
    // Call the Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured in environment variables');
      return NextResponse.json(
        { error: 'API key not configured. Please add your Gemini API key to the .env file.' },
        { status: 500 }
      );
    }
    
    console.log('Making request to Gemini API...');
    
    // Use the stable Gemini-1.5-pro model instead of the experimental version
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are a nutritional analysis expert. Analyze this food image and provide the following information:\n1) Food identification: What food item(s) is shown in the image?\n2) Estimated calories per serving\n3) Key nutritional benefits (proteins, vitamins, minerals, etc.)\n4) Potential allergens or dietary considerations\n\nFormat your response in clear, labeled sections with bullet points where appropriate."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      
      try {
        // Try to parse as JSON if possible
        const errorData = JSON.parse(errorText);
        console.error('Parsed error:', errorData);
        
        // Extract a meaningful error message if available
        const errorMessage = errorData.error?.message || 'Error from Gemini API';
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        );
      } catch {
        // If parsing fails, return the raw text
        return NextResponse.json(
          { error: `Error from Gemini API: ${errorText.substring(0, 100)}...` },
          { status: response.status }
        );
      }
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API');
    
    if (data.promptFeedback?.blockReason) {
      console.error('Content blocked:', data.promptFeedback);
      return NextResponse.json(
        { error: 'The request was blocked for safety reasons. Please try a different image.' },
        { status: 400 }
      );
    }
    
    // Extract the text from the Gemini response
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in Gemini response:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: 'No analysis results returned from the AI model. Please try a different image.' },
        { status: 500 }
      );
    }
    
    const analysisText = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!analysisText) {
      console.error('No text in Gemini response:', JSON.stringify(data.candidates[0], null, 2));
      return NextResponse.json(
        { error: 'No text content in the AI model response. Please try a different image.' },
        { status: 500 }
      );
    }
    
    // Sanitize the analysis text to prevent XSS
    const sanitizedText = analysisText
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    return NextResponse.json({ 
      analysis: sanitizedText
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'self'",
        'X-Content-Type-Options': 'nosniff'
      }
    });
    
  } catch (error) {
    console.error('Error analyzing food image:', error);
    
    // Determine if it's an abort error (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'The request timed out. Please try again with a smaller image.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze the image. Please try again.' },
      { status: 500 }
    );
  }
} 