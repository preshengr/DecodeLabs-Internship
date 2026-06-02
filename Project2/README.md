# Project2 — Smart Tech Limited Website

## Overview

This folder contains a responsive landing site for **Smart Tech Limited**, a gadget repair business. The project uses plain HTML and CSS to build a clean, modern website with multiple pages and a mobile-friendly navigation experience.

## What’s included

- `index.html` — The homepage. It introduces the business, highlights services, shows testimonials, and includes a call-to-action.
- `about.html` — A company introduction page with brand story, values, and business strengths.
- `services.html` — A service menu page that lists repair offerings, pricing features, and appointment details.
- `contact.html` — A contact page with customer support details and a repair booking form.
- `assets/css/style.css` — The main stylesheet that controls layout, typography, colors, animations, responsive design, and the mobile hamburger navigation.
- `assets/images/` — Stores the visual assets used across pages, such as hero images, service images, and testimonials.

## Project structure explained

### `index.html`

This is the landing page visitors first see. It includes:

- fixed top navigation
- hero section with title, description, and action buttons
- service cards showing the top repair categories
- process section explaining how repair works in 4 steps
- customer testimonials
- a footer with contact information and navigation links

### `about.html`

Designed to build trust and credibility by showing:

- company story
- years of experience
- mission statement
- team values and brand promise

### `services.html`

Shows the full service offering and pricing details. Typical sections include:

- phone repair services
- laptop repair services
- tablet repair services
- appointment booking call-to-action

### `contact.html`

Includes contact information plus any form or location details so customers can reach out easily.

### `assets/css/style.css`

This file contains all styling rules for the website. Important parts include:

- CSS variables for colors, fonts, and spacing
- layout helpers for responsive grids and flex containers
- typography styles for headings and body text
- navigation styling for desktop and mobile
- card and button components
- responsive breakpoints for tablets and phones

## Responsive navigation

This project uses a **mobile-friendly hamburger nav** that appears on smaller screens. The navigation is built with:

- desktop navigation links visible on wide screens
- a CSS-only hamburger menu for mobile using the `<details>` element
- a slide-out style mobile panel with navigation links and a CTA button

## How to use this project

1. Open the project folder in your code editor.
2. Edit the HTML files to change text, links, or images.
3. Modify `assets/css/style.css` to adjust the colors, layout, or spacing.
4. Preview the pages by opening any HTML file in a browser.
5. Resize the browser window or use browser developer tools to test responsive behavior.

## Learning tips for beginners

- Start by reading each HTML page from top to bottom. Notice how sections are grouped with comments like `<!-- NAVIGATION -->` and `<!-- HERO -->`.
- Watch how classes like `nav`, `hero`, `service-card`, and `footer` are styled in `style.css`.
- Use the browser inspector to see how CSS rules apply to page elements.
- Try changing one style at a time, refresh the page, and observe the effect.
- Keep the directory structure organized: HTML files stay in the root of `Project2`, while reusable assets remain under `assets/`.

## Recommended next steps

- Add a new page, such as `faq.html` or `testimonials.html`.
- Add more services to `services.html` and style them with the existing card classes.
- Replace placeholder images with your own pictures in `assets/images/`.
- Add a simple JavaScript file to enhance the mobile menu or add smooth scroll behavior.

---

This project is a great starting point for learning modern HTML and CSS structure, responsive design, and clean working file organization.
