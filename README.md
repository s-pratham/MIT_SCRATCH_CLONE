# Scratch Clone in React Native

A **Scratch** clone developed using **React Native** and **Expo**, designed to simulate the interactive coding environment found on [Scratch](https://scratch.mit.edu/). This project brings similar features to mobile devices, allowing users to manipulate sprites, execute actions, and interact with an intuitive visual coding environment.

[Download on Android](https://expo.dev/accounts/pratham96/projects/Sticker/builds/18f38236-887c-4471-a71e-298d3cf7c8cf)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

This project is a mobile-friendly, React Native clone of **Scratch**, an open-source visual programming language and online community. The app enables users to create projects by combining sprites and actions, interacting with them visually, and executing actions. Designed for learning and creativity, it’s a fun introduction to programming basics on a mobile platform.

## Features

- **Sprite Management**: Add, manipulate, and position sprites on a visual stage.
- **Actions**: Apply actions such as movement, rotation, and scaling to sprites.
- **Collision Detection**: Swap actions between sprites when they collide.
- **Gesture Control**: Move sprites on the stage using drag gestures.
- **Reset and Play Controls**: Reset all sprites to their initial state or play a sequence of actions.
- **Expandability**: Codebase is designed for easy extension to add more actions or sprite types.

## Installation

Follow these steps to install the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/s-pratham/MIT_SCRATCH_CLONE
   cd MIT_SCRATCH_CLONE
   ```

2. **Install Dependencies**:
   Make sure you have [Node.js](https://nodejs.org) and [Expo CLI](https://docs.expo.dev/get-started/installation/) installed.
   ```bash
   npm install
   ```

3. **Start the App**:
   Launch the Expo development server.
   ```bash
   npm start
   ```

   Use the Expo Go app on your mobile device or an Android/iOS emulator to view the project.

### Android Installation

To directly install the app on an Android device, download it from [this link](https://expo.dev/accounts/pratham96/projects/Sticker/builds/18f38236-887c-4471-a71e-298d3cf7c8cf).

## Getting Started

1. **Open the App** and explore the Scratch-like features:
   - Add a new sprite to the stage by tapping the **"+"** button.
   - Apply actions to sprites and watch them move or rotate on the stage.
   - Reset the sprites to bring them back to their default positions.
2. **Experiment with different actions and gestures** to fully explore the app’s capabilities.

## Project Structure

The project is organized into the following key folders and files:

- **`index.tsx`**: The main app component where navigation is set up.
- **`/screens`**: Contains screen components like `Home` and `ActionScreen`.
- **`/components`**: Holds reusable UI components used across screens.
- **`/assets`**: Contains images and other static assets.
- **`/types`**: Contains TypeScript types and interfaces.

## Technologies Used

- **React Native** with **Expo**: Framework for cross-platform mobile app development.
- **TypeScript**: Provides type safety and better developer experience.
- **React Navigation**: Handles navigation and routing between screens.
- **React Native Gesture Handler**: Enables advanced gesture control for moving and manipulating sprites.
- **Expo**: Simplifies development and distribution of the app.

## Acknowledgements

This project is inspired by the Scratch project on [Scratch's Official Website](https://scratch.mit.edu/). Thanks to the open-source community for resources and tutorials that helped in building this app.

## License

This project has no assigned license.

---

Feel free to contribute, report issues, or suggest new features to enhance the project!
