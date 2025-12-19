🚧 QR Qualz

QR Qualz is a project I am designing with the intention of providing an easier way to view the qualifications of employees on a job site.

This version is a very early rendition of the project that acts as a proof of concept. The design is quite rudimentary, but it gets the job done.

I am currently developing it for a colleague of my fiancé’s father who works at Centuri.
They have a problem with keeping track of employee qualifications and making them easily accessible on the job site.

This project aims to solve that problem by creating editable employee cards, which can easily be pulled up by simply scanning a QR code.

⭐ STAR Breakdown

S — Situation

> I am currently developing QR Qualz as a fun side project for a colleague of my fiancé’s father who works at Centuri.
> This individual has the problem of keeping track of employee qualifications and making them easily accessible on the job site.

> The qualifications are currently being stored on a spreadsheet, which makes the task of looking up an employee’s qualifications on the fly feel cumbersome.

T — Task

> This project aims to solve that problem by creating editable employee cards, which can easily be pulled up by simply scanning a QR code.

> This would streamline their process of keeping track of employee qualifications, while providing a quick and easy way to access desired information.

> Each employee would simply attach their QR code to something they carry with them (e.g., their hard hat), and a site manager could scan the QR code to verify if an employee has the required qualifications.

A — Action

> To make this project a reality, I turned the spreadsheet into a JSON file, which is where I am currently storing all of the employee data.

> The JSON acts as the database where the current state of the data is stored (I will be transitioning to MongoDB in future versions of the project).

> The JSON file is parsed using JavaScript, which is then used to create each employee’s card.

> The QR code is created by combining the page URL and a hash from a unique HTML id attribute, which is derived from the employee’s first and last name.
> This allows each employee to have their own QR link to their element on the webpage, which is automatically scrolled to and expanded to reveal the qualifications of the desired employee.

> The qualifications are editable and use a PHP script to save the changes back to the JSON file.
> This currently only works when the project is hosted locally.

R — Result

> At this point in development, I have created a proof of concept for what will turn into a versatile application, and I am excited to continue developing this application.

> It is currently stored on a Raspberry Pi and hosted using an Apache server, which is used to show that the QR codes work as expected.

> This project has much more work to be done, and I will continue to update this page to reflect those milestones! 🚀
