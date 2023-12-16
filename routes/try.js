const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Function to load controllers dynamically
const loadControllers = () => {
    const controllers = {};
    const controllerDirs = ['pos', 'ecommerce'];

    controllerDirs.forEach(dir => {
        // Adjust this path as necessary
        const controllerPath = path.join(__dirname, '../controllers', dir);
        console.log(`Looking in: ${controllerPath}`); // Debugging output

        try {
            const controllerFiles = fs.readdirSync(controllerPath);
            controllerFiles.forEach(file => {
                if (file.endsWith('.js')) {
                    const controller = require(path.join(controllerPath, file));
                    Object.assign(controllers, controller);
                }
            });
        } catch (error) {
            console.error(`Error loading controllers from ${controllerPath}:`, error);
        }
    });

    return controllers;
};


// Load controllers
const controllers = loadControllers();

  console.log('====================================');
  console.log(controllers);
  console.log('====================================');
