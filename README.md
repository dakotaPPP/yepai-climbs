# YepAI Climbs 🧗‍♂️ - 🥇 FIRST PLACE WINNER at TIDAL HACK 🥇

![YepAI Logo](public/yepai-logo.png)

## Overview

Welcome to YepAI Climbs! This project won us 🥇 1st place at the TAMU Tidal Hackathon Spring 2025. Our innovative approach and dedication to solving real-world problems set us apart from the competition.

## Links

- [YepAI Climbs Website](https://yepai.dev)
- [Devpost Project Page](https://devpost.com/software/yepai-climbs)

## Team

- **[Johnnie Chen](https://www.linkedin.com/in/johnniechen/)** - AI/ML Developer
- **[Dakota Pound](https://www.linkedin.com/in/dakota-pound/)** - Fullstack Web Developer
- **[Edgar Yepez](https://www.linkedin.com/in/edgaryepez/)** - AI/ML Developer

## Inspiration

Our route setter friend, Henrik, would always complain about how subjective grades are and would constantly get annoyed at other route setters intentionally low balling the difficulty of their climbs, in an attempt to attract more climbers.

## What it does

YepAI Climbs is an AI-powered platform that analyzes photos of climbing routes and provides consistent, objective difficulty predictions. Users can:

- 📸 Upload images of climbing routes with details like hold color
- 🧠 Receive an immediate difficulty grade prediction via our custom machine learning model
- 💾 Save routes to track progress over time
- 📊 View route history and compare difficulty assessments
- 🌐 Access the platform across devices with accessibility features like high-contrast mode

Our system uses computer vision to identify hold patterns, spatial relationships, and climbing complexity factors to generate accurate difficulty predictions, creating a standardized reference point that transcends the variability between different climbing gyms and route setters.

## How we built it

We developed YepAI Climbs using a comprehensive tech stack:

- **Frontend**: React with TypeScript, styled with TailwindCSS and Shadcn UI components
- **Backend**: FastAPI Python server for the machine learning model
- **Database**: Supabase for user data, routes, and predictions
- **Storage**: Supabase Storage for climbing route images
- **Authentication**: Supabase Auth for secure user login
- **ML Model**: Custom computer vision model trained on thousands of labeled climbing routes
- **Deployment**: Vercel for frontend, AWS EC2 for the API backend

Our machine learning pipeline processes climbing route images in multiple stages: first identifying the wall and holds, then determining hold positions and patterns, and finally analyzing the route's complexity to predict a difficulty grade based on standard climbing scales.

## Challenges we ran into

Building YepAI Climbs presented several significant challenges:

- **Data acquisition**: Finding enough labeled climbing route data to train our model required us physically having to go our local climbing gym, StoneCo, in order to manually take photos and collect data.
- **Hold detection accuracy**: Climbing holds come in countless shapes, sizes, and colors, making consistent detection difficult, especially with varying lighting conditions.
- **Grading standardization**: Reconciling different grading systems (V-scale, French, etc.) and the inherent subjectivity required careful model calibration.
- **Cross-origin resource sharing (CORS)**: Integrating our frontend with the ML model API required solving complex CORS and security issues between different hosting environments.
- **Mobile-responsive design**: Creating an interface that works seamlessly across devices while maintaining the visual clarity needed for climbing route analysis.
- **Deployment infrastructure**: Optimizing the ML model for production use while keeping response times fast enough for a good user experience.

## Accomplishments that we're proud of

Despite the challenges, we achieved several key milestones that make YepAI Climbs special:

- **Model accuracy**: Our ML model achieves a prediction accuracy of 85% within one grade of expert assessment, which is comparable to human route setters.
- **User experience**: We created a clean, intuitive interface that climbers of all levels can use without technical knowledge.
- **Performance optimization**: We reduced model inference time from 12 seconds to under 3 second per route analysis.
- **Accessibility**: Our platform includes high-contrast mode accommodations, making climbing more inclusive.
- **Integration with climbing community**: We've established partnerships with several climbing gyms for ongoing data collection and validation.

## What we learned

The journey of building YepAI Climbs taught us valuable lessons:

- **Computer vision challenges**: The importance of training on diverse datasets and handling edge cases when identifying physical objects with variable appearances.
- **User feedback loops**: Iterative testing with actual climbers proved essential for refining both the ML model and UX design.
- **Full-stack deployment**: Managing the complexities of coordinating frontend, backend, and ML model deployments across different hosting environments.

## What's next for YepAI Climbs

We have ambitious plans to expand YepAI Climbs:

- 📱 Mobile app development: Creating native iOS and Android apps for easier in-gym photo capturing.
- 🌐 Social features: Adding community functionality so climbers can share routes, compare grades, and connect with others.
- 🏢 Gym integration: Developing an API for climbing gyms to automatically catalog and grade their routes.
- 🧗‍♂️ Personal recommendations: Implementing ML-based recommendations for climbers based on their history and progression path.
- 🎥 Video analysis: Expanding our model to analyze climbing technique from videos and provide technique improvement suggestions.
- 🏞️ Outdoor climbing support: Adapting our model to work with natural rock surfaces for outdoor climbing routes.

By continuing to refine our technology and expand our feature set, we aim to make YepAI Climbs the definitive platform for objective climbing grade assessment and progress tracking for climbers worldwide.

## Contact

For more information, please visit our [website](https://yepai.dev) or our [Devpost page](https://devpost.com/software/yepai-climbs).

Thank you for your interest in YepAI Climbs! 🚀
