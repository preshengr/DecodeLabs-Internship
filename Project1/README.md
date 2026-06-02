# Project1 — Smart Tech Limited Website

## Overview

This folder contains a responsive small business website built with plain HTML and CSS. It is structured to help beginners understand how web pages are organized and how styling can be applied consistently across multiple pages.

## Project structure

- `index.html` — The homepage showcasing the business, services, process, testimonials, and call-to-action.
- `about.html` — An about page describing the company story, expertise, and brand values.
- `services.html` — A services page that lists repair offerings and explains the pricing or process.
- `contact.html` — A contact page for customers to get in touch and request repairs.
- `assets/` — Contains external site resources like CSS and images.
  - `assets/css/style.css` — The main stylesheet for layout, colors, typography, responsive design, and mobile navigation.
  - `assets/images/` — The image folder used in the hero sections, cards, and testimonials.

## What each file does

### `index.html`
This page is the primary landing page of the website. It includes:
- navigation bar with logo and menu links
- hero section with headline, description, and action buttons
- services overview cards with pricing
- step-by-step repair process
- testimonials section
- footer with contact and navigation links

### `about.html`
This page explains the company and builds trust with visitors. Important features include:
- a company story and mission statement
- service experience and repair expertise
- trust-building text and supporting visuals
- buttons that encourage visitors to explore services or contact the business

### `services.html`
This page highlights the repair services offered by the business. It typically includes:
- a service hero section with breadcrumbs and page title
- detailed service cards for phones, laptops, tablets, and more
- pricing or feature details
- an appointment or booking call-to-action

### `contact.html`
This page provides contact information and a way to reach the business. It may contain:
- address, phone number, and email details
- customer support or booking instructions
- a contact form or appointment booking section
- a consistent footer for navigation and company details

### `assets/css/style.css`
This stylesheet controls the website’s visual appearance. It includes:
- CSS variables for colors, fonts, spacing, and shadows
- layout helpers such as grid and flex utilities
- typography settings for headings, body text, and buttons
- responsive design breakpoints for tablets and mobile devices
- styling for navigation, hero sections, cards, forms, and footer

## Mobile and responsive design

The site is designed to be responsive, which means it adjusts to different screen sizes:
- on desktop, the navigation menu and content layout are fully visible
- on smaller screens, the layout becomes one-column and images resize
- the stylesheet includes media queries to adapt grids, form layouts, and footer structure
- a mobile hamburger menu is used to keep navigation easy to access on phones

## How beginners can work with this project

1. Open the files in a code editor.
2. Examine the HTML structure in each page. Look for comments like `<!-- NAVIGATION -->`, `<!-- HERO -->`, and `<!-- FOOTER -->`.
3. Open `assets/css/style.css` and see how classes are styled.
4. Change text and links in the HTML to personalize the content.
5. Change colors and spacing in the CSS to experiment with the design.
6. Open the pages in a browser and refresh after each change.
7. Use browser developer tools to inspect elements and see which CSS rules apply.

## Tips for learning

- Start small: change one CSS value and reload the browser.
- Use the browser inspector to view the page structure and class names.
- Compare the different HTML files to understand how shared components are reused.
- Keep the `assets/` folder for files that are shared across pages.
- Save your changes often and test on different screen widths.

## Recommended next steps

- Add a new page such as `faq.html` or `gallery.html`.
- Add more service cards to `services.html` and style them with existing classes.
- Replace placeholder images in `assets/images/` with your own photos.
- Add a small JavaScript file later to enhance interactivity, like a scroll animation or menu toggle.
