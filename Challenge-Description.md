### Your objective is to create a patient registration application using Laravel or FastAPI. You are required to implement the following functionalities:



1) An API for patient registration that collects the following information: name, email address, phone number, and a photo of the document.
2) The application must perform validation on user-entered data to ensure that all required fields are provided and valid as needed.
3) Upon successful validation of patient data, store it in a PostgreSQL database.
4) After a patient is successfully registered, asynchronously send a confirmation email to prevent application blocking. It is not necessary to design the email; you can use the framework's default template.
5) Utilize Docker to establish the development environment for the application.

### Additionally, take into account the following points

- Adhere to Laravel's/FastAPI structure, conventions, and best practices that you consider suitable for organizing your code.
- Verify that your application functions correctly in some manner.
- Utilize Laravel's validation/pydantic validation to authenticate user-entered data.
- Employ a PostgreSQL database to store patient data.
- Develop the product with the understanding that SMS notifications will be required within two months.
- Configuring an actual email server is not obligatory. You can employ a library like "Mailtrap" to test email transmission within a development environment.
- Use Docker to generate a consistent and replicable development environment

Upon completion, kindly provide the repository in Git and forward it to your recruiter for evaluation

#### Disclaimer
- Remember not to use your name in the source code to keep the process as anonymous as possible