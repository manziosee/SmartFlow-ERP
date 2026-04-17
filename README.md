# SmartFlow ERP

SmartFlow ERP is an intelligent, AI-powered financial and operations platform specifically designed for Small and Medium Enterprises (SMEs). It modernizes traditional ERP suites by placing AI-driven insights, automation, and real-time operational analytics at the core of the user experience.

## Tech Stack

The architecture is driven by a decoupled full-stack design utilizing modern, industry-standard languages and frameworks:

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

- **Frontend (`/erp-frontend`)**: A modern, high-performance web application built with **Next.js**, React, and Tailwind CSS. It features a premium, dynamic user interface enriched by Shadcn UI and Recharts. 
- **Backend (`/erp`)**: A highly secure API powered by **Spring Boot (Java 21)**. It orchestrates user authentication (JWT), data persistence (PostgreSQL / JPA), and integrates advanced optimization logic via **Timefold Solver**.

## Key Features

- **Automated Invoicing**: Streamline billing with rapid generation and dynamic payment lifecycle tracking.
- **AI Business Insights**: Receive AI-generated recommendations and predictive flagging for approaching financial constraints.
- **Smarter Workflows**: Manage global contexts dynamically, allowing features such as persistent, region-specific currency tracking directly in the dashboard UI.
- **Client & Payment Recovery**: Automated metrics mapping out active clients and long-standing overdue revenues.

## Getting Started

### Starting the Frontend
```bash
cd erp-frontend
npm install
npm run dev
```

### Starting the Backend
```bash
cd erp
mvn spring-boot:run
```

