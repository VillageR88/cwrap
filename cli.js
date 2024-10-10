#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const readline = require("node:readline");

// Path to the package.json file
const packageJsonPath = path.join(__dirname, "package.json");

// Read and parse the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Extract the version of cwrap-framework
const cwrapFrameworkVersion = packageJson.devDependencies["cwrap-framework"];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Enter project name (default: my-new-cwrap-project): ", (input) => {
	const projectName = input.trim() || "my-new-cwrap-project"; // Default project name

	const projectPath = path.resolve(process.cwd(), projectName);

	if (fs.existsSync(projectPath)) {
		console.error(`Directory ${projectPath} already exists.`);
		process.exit(1);
	}

	fs.mkdirSync(projectPath, { recursive: true });
	console.log(`Creating a new project in ${projectPath}`);

	const newPackageJson = {
		name: projectName,
		version: "1.0.0",
		main: "index.js",
		scripts: {
			start: "start http://localhost:36969 && node server.js",
			build: "node build.js",
		},
		devDependencies: {
			"cwrap-framework": cwrapFrameworkVersion,
			"body-parser": "^1.20.2",
			connect: "^3.7.0",
			"connect-livereload": "^0.6.1",
			jsdom: "^24.1.1",
			livereload: "^0.9.3",
			mkdirp: "^3.0.1",
			"serve-static": "^1.14.1",
		},
	};

	fs.writeFileSync(
		path.join(projectPath, "package.json"),
		JSON.stringify(newPackageJson, null, 2),
	);

	console.log("Installing packages. This might take a couple of minutes.");
	try {
		execSync("npm install", { stdio: "inherit", cwd: projectPath });
	} catch (error) {
		console.error("Error installing packages:", error.message);
		process.exit(1);
	}

	console.log("Project setup complete!");

	rl.close();
});
