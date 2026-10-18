🎬 CineBook — Movie Ticket Management System

A modern, responsive, frontend-based movie ticket management system built to provide a simple and interactive movie browsing and ticket booking experience. The project also integrates **Grafana Faro for frontend monitoring** and **GitHub Actions for CI/CD automation**, with Docker support for containerization.

🌐 Live Demo

Live Website:** [CineBook on GitHub Pages](https://swateaa.github.io/movie-ticket-management/)

GitHub Repository:** [movie-ticket-management](https://github.com/swateaa/movie-ticket-management)

✨ Features

- 🎥 **Movie Browsing:** Explore the available movies through dynamic movie cards.
- 🔍 **Movie Search:** Search for movies by title.
- 🎭 **Genre Filtering:** Filter movies according to genre.
- 🎟️ **Ticket Booking Interface:** Interact with the movie ticket booking interface.
- 🔐 **Login Interface:** Access the login page and user interface.
- 🧭 **Navigation:** Move between different sections of the application.
- 📱 **Responsive Design:** A user-friendly interface designed for different screen sizes.
- 📊 **Frontend Monitoring:** Grafana Faro integration for monitoring page loads and frontend errors.
- ⚙️ **CI/CD Automation:** GitHub Actions workflow to automate Docker image builds and publishing.
- 🐳 **Docker Support:** Package and serve the frontend using an Nginx container.

🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, layout, and responsive design |
| JavaScript | Interactive functionality and movie browsing |
| GitHub | Source code management |
| GitHub Pages | Frontend hosting |
| GitHub Actions | CI/CD automation |
| Docker | Frontend containerization |
| Nginx | Serving the frontend inside the container |
| Grafana Faro | Real-user frontend monitoring |

🏗️ Project Structure

text
movie-ticket-management/
│
├── index.html
├── style.css
├── script.js
├── Dockerfile
├── README.md
│
└── .github/
    └── workflows/
        └── docker-publish.yml


🚀 Getting Started

Option 1: Run the Website

1. Open the [GitHub repository](https://github.com/swateaa/movie-ticket-management).
2. Open `index.html`.
3. Launch the live website using the GitHub Pages link above, or download the project files and open `index.html` in a browser.

Option 2: Run with Docker

Make sure Docker is installed on your system.

Build the Docker image from the project directory:

```bash
docker build -t cinebook-frontend .
```

Run the container:

```bash
docker run -d -p 8080:80 --name cinebook cinebook-frontend
```

Open the application in your browser:

```text
http://localhost:8080
```

To stop the container:

```bash
docker stop cinebook
```

🔄 CI/CD Pipeline

CineBook uses GitHub Actions to automate the Docker image publishing process.

Pipeline Workflow

1. **Code Push:** Changes are pushed to the `main` branch.
2. **Workflow Trigger:** GitHub Actions detects relevant changes to the frontend files, Dockerfile, or workflow.
3. **Checkout:** The repository source code is checked out.
4. **Docker Setup:** Docker Buildx is configured.
5. **Authentication:** GitHub Actions logs in to Docker Hub using repository secrets.
6. **Build:** A Docker image is built using the Dockerfile.
7. **Publish:** The image is pushed to Docker Hub with `latest` and commit-specific tags.

Required GitHub Secrets
Configure these under **Repository → Settings → Secrets and variables → Actions**.

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Your Docker Hub access token |

**Note:** The Docker publishing workflow uploads the image to Docker Hub. Running the container in production requires a separate hosting environment.

📊 Grafana Frontend Monitoring

CineBook integrates Grafana Faro Web SDK to collect frontend telemetry from the deployed website.

### Monitoring Capabilities

- Page-load telemetry
- Frontend error monitoring
- User-session visibility, where supported and configured
- User-action monitoring, where supported and configured
- Browser-side tracing instrumentation

Monitoring Setup

The Faro SDK is configured in the HTML document's `<head>` section.

The application configuration uses:

- **Application name:** CineBook
- **Version:** 1.0.0
- **Environment:** production
- **Allowed origin:** `https://swateaa.github.io`

The Grafana Frontend Observability application can be accessed through your Grafana Cloud account.

> **Privacy and security:** Browser-side monitoring configuration is visible to website visitors. Never place private API keys, passwords, or secret tokens in frontend code.

🌍 Deployment

GitHub Pages

The frontend is hosted through GitHub Pages.

Live URL: https://swateaa.github.io/movie-ticket-management/

Docker Hub

GitHub Actions can publish the container image to Docker Hub whenever the configured workflow runs successfully.

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username when pulling the image:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/cinebook-frontend:latest
```

⚠️ Project Scope

CineBook is a **frontend-only project**. It does not currently include a backend server or database.

Login and booking interfaces should therefore be treated as frontend demonstrations unless a backend service is added. Persistent user accounts, secure authentication, payment processing, and server-side ticket reservations are outside the current scope.

🎯 Project Objectives

- Develop an interactive movie ticket booking interface.
- Practice frontend development using HTML, CSS, and JavaScript.
- Deploy a static website using GitHub Pages.
- Implement CI/CD automation using GitHub Actions.
- Package the application using Docker and Nginx.
- Integrate Grafana Faro for frontend observability.

🔮 Future Enhancements

- Backend integration and database connectivity
- Secure user authentication
- Real-time seat availability
- Online payment integration
- Booking history and downloadable tickets
- Automated testing in the CI/CD pipeline
- Container hosting with infrastructure monitoring

👩‍💻 Author

**Swati**
**Shivansh**
**Yash**

GitHub: [@swateaa](https://github.com/swateaa)
⭐ If you find this project useful, consider giving the repository a star.

**Built with HTML, CSS, JavaScript, Docker, GitHub Actions, and Grafana.**
