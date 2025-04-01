# Nu. | Know what's in it.

Nu. is an AI-powered nutritional analysis application that helps users discover what's in their food.

**Live Website:** [https://nu.ihusam.tech](https://nu.ihusam.tech)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technical Documentation

### Architecture

Nu. is built using a modern web application stack:

- **Frontend Framework**: Next.js 14 with React and App Router
- **Styling**: Tailwind CSS for responsive design
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Media Handling**: Next.js Image component for optimized image loading
- **Routing**: Next.js App Router for file-based routing
- **Accessibility**: ARIA attributes and semantic HTML

### Project Structure

```
nu/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── console/    # Nu. It tool page
│   │   ├── about/      # About page
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Homepage
│   ├── components/     # Reusable UI components
│   └── lib/            # Utility functions and hooks
├── package.json        # Project dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

### Core Features

1. **AI-Powered Nutritional Analysis**: Upload food images and receive detailed nutritional information
2. **Interactive Console**: User-friendly interface for analyzing food through "Nu. It"
3. **Responsive Design**: Optimized for all device sizes
4. **Accessibility**: Built with web accessibility standards in mind

### Development Workflow

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Make changes and see them reflected in real-time
5. Build for production with `npm run build`

## White Paper: Nu. - AI-Powered Nutritional Analysis

### Introduction

Nu. is an innovative application designed to bridge the knowledge gap between consumers and the food they consume. Using advanced AI image recognition and nutritional databases, Nu. allows users to quickly identify ingredients and nutritional content in food products.

### The Problem

Modern consumers face several challenges regarding food consumption:

1. **Ingredient Transparency**: Food labels can be difficult to interpret or incomplete
2. **Dietary Restrictions**: People with allergies or specialized diets need accurate information
3. **Nutritional Awareness**: Understanding the nutritional profile of foods, especially baked goods and prepared foods
4. **Time Constraints**: Traditional manual research of food contents is time-consuming

### Our Solution

Nu. leverages artificial intelligence to provide:

- **Instant Analysis**: Upload a photo of food to receive immediate nutritional breakdown
- **Comprehensive Data**: Calories, macronutrients, micronutrients, and ingredient lists
- **Accessible Interface**: User-friendly design that makes nutritional information easy to understand
- **Educational Component**: Learn about food components and their health implications

### Technology

Nu. combines several technologies:

1. **Computer Vision AI**: Identifies food items from images
2. **Nutritional Databases**: Cross-references identified foods with extensive nutritional information
3. **Machine Learning**: Continuously improves accuracy through user feedback
4. **Next.js Web Application**: Delivers a seamless, responsive user experience

### Benefits and Use Cases

- **Consumers**: Make informed dietary choices
- **People with Allergies**: Quickly identify potential allergens
- **Fitness Enthusiasts**: Track nutritional intake accurately
- **Health Professionals**: Support clients with reliable food information
- **Food Businesses**: Provide transparency to customers

### Conclusion

Nu. represents a significant step forward in food transparency and nutritional awareness. By making comprehensive food information accessible through AI technology, we empower users to make better dietary choices and understand what's truly in their food.

---

This project is developed by the Nu | ihusam.tech Team. For more projects, visit [ihusam.tech](https://projects.ihusam.tech/).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
