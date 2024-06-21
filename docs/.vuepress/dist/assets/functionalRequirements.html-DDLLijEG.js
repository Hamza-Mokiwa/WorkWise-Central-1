import{_ as e,c as t,o as s,b as i}from"./app-Di2dHnTD.js";const l={},a=i('<h1 id="functional-requirements" tabindex="-1"><a class="header-anchor" href="#functional-requirements"><span>Functional Requirements</span></a></h1><h3 id="authorization-and-authentication-subsystem" tabindex="-1"><a class="header-anchor" href="#authorization-and-authentication-subsystem"><span>Authorization and Authentication Subsystem</span></a></h3><ul><li><p>The system must allow a new user to sign up.</p><ul><li>The system must allow the user to sign up using their email address.</li><li>The system must allow the user to input their personal details.</li><li>The system must then allow the user to either join an existing company or to create a company. <ul><li>The user must be able to search for a company to join by name.</li><li>The user must be able to join a company using their company ID.</li></ul></li><li>When creating a company, the system must allow the user to enter all the information related to that company.</li></ul></li><li><p>The system must allow a user to log in to an existing account.</p><ul><li>The system must allow a user to log in using their username and password.</li></ul></li></ul><h3 id="roles-and-permissions" tabindex="-1"><a class="header-anchor" href="#roles-and-permissions"><span>Roles and Permissions</span></a></h3><p>Roles are commonly used groupings of permissions that can be assigned to a user.</p><ul><li>The system must provide the following permissions: <ul><li>Allow the user to view all employees.</li><li>Allow the user to edit employees.</li><li>Allow the user to add new employees.</li><li>Allow the user to view all job.</li><li>Allow the user to view all jobs that are assigned to employees that work under the user.</li><li>Allow the user to view all jobs assigned to the current user.</li><li>Allow the user to edit all jobs.</li><li>Allow the user to edit jobs that are assigned to employees that work under the user.</li><li>Allow the user to edit jobs that are assigned to them.</li><li>Allow the user to add a new job.</li><li>Allow the user to view all clients.</li><li>Allow the user to view all client that are associated with a job that is assigned to a employee that works under the user.</li><li>Allow the user to view all client that are associated with a job that is assigned to the user.</li><li>Allow the user to edit all clients.</li><li>Allow the user to edit all client that are associated with a job that is assigned to a employee that works under the user.</li><li>Allow the user to edit all client that are associated with a job that is assigned to the user.</li><li>Allow the user to view all inventory.</li><li>Allow the user to edit all inventory.</li><li>Allow the user to add a new inventory item.</li><li>The system must allow all employees that have been allocated to a job, to record the inventory they have used and thus change the amount of a certain item(/s) in the inventory.</li></ul></li><li>The system must provide a super user, which represents the owner of the company. This user must have full permissions by default.</li><li>The system must protect the permissions of the owner such that no-one can change their permissions.</li><li>The system must assign the user who registered the company as the owner.</li><li>The system must provide a set of default roles: <ul><li>The system must provide an admin role and by default the role must have full permissions.</li><li>The system must provide a supervisor role and provide the following default permissions: <ul><li>View all jobs under the user.</li><li>Edit all jobs under the user.</li><li>View all employees under the user.</li><li>Edit all employees under the user.</li><li>View client for all the jobs under the user.</li><li>Edit all clients for jobs under the user.</li></ul></li><li>Team leader. Must have the following permissions: <ul><li>View all jobs under the user.</li><li>Edit all jobs under the user.</li><li>View all employees under the user.</li><li>Edit all employees under the user.</li><li>View client for all the jobs under the user.</li><li>Edit all clients for jobs under the user.</li></ul></li><li>Worker. Must have the following permissions: <ul><li>View all the jobs the user has been assigned to.</li><li>View client who are associated with a job the user has been assigned to.</li></ul></li></ul></li><li>The roles of a given company must be able to change (refer to the company setting subsystem above)</li></ul><h3 id="employee-subsystem" tabindex="-1"><a class="header-anchor" href="#employee-subsystem"><span>Employee Subsystem</span></a></h3><p>All users (except owners) are employees of companies. Each employee has information associated with them.</p><ul><li>The system must ensure that a user (employee) is part of at least one company.</li><li>The system must store all information associated with an employee.</li><li>The system must allow the users to be allocated roles in the company.</li><li>For employees with view permissions, the system must show the following: <ul><li>The system must display all the current employees of the company.</li><li>The user must be able to search for a specific employee.</li><li>The user must be able to sort the list of employees.</li><li>The user must be able to filter the list of employees.</li></ul></li><li>For employees with edit permissions, the system must show the following: <ul><li>The system must display everything that a user with view permission can see.</li><li>The system must show the number of jobs the employee has assigned to them.</li><li>The system must show each of the jobs assigned to a specific employee.</li><li>The system must allow the user to assign jobs to a particular employee.</li></ul></li></ul><h3 id="settings-subsystem" tabindex="-1"><a class="header-anchor" href="#settings-subsystem"><span>Settings Subsystem</span></a></h3><h4 id="account-and-profile-settings-subsystem" tabindex="-1"><a class="header-anchor" href="#account-and-profile-settings-subsystem"><span>Account and Profile Settings Subsystem</span></a></h4><ul><li>The system must allow the user to view their personal information.</li><li>The system must allow the user to edit their personal information.</li><li>The system must allow the user to log out of their account.</li><li>The system must allow the user to delete their account.</li><li>The system must allow the user to leave a company.</li><li>The system must allow the user to join a company.</li><li>The system must allow the user to edit their preferences: <ul><li>They must be able to change their themes.</li><li>They must be able to change their preferred language.</li><li>They must be able to change their notification settings.</li><li>They must be able to change their default home page.</li></ul></li></ul><h4 id="company-settings-subsystem" tabindex="-1"><a class="header-anchor" href="#company-settings-subsystem"><span>Company Settings Subsystem</span></a></h4><ul><li>The system must allow the user to view all the settings for the company if they have permission.</li><li>The system must allow the roles in the company to be changed. <ul><li>The system must allow the number of roles to be increased or decreased.</li><li>The system must allow the labels for each role to be altered.</li><li>The system must allow the permissions associated with a role to be changed.</li></ul></li><li>The system must allow the statuses available for the jobs to change. <ul><li>The system must allow the labels for each status to be changed.</li></ul></li><li>The system must display all the information of to the company.</li><li>The user (if given permission) must be able to edit the information pertaining to the company.</li></ul><h3 id="company-subsystem" tabindex="-1"><a class="header-anchor" href="#company-subsystem"><span>Company Subsystem</span></a></h3><ul><li>A user must be able to register a company on the system.</li><li>The registration process needs to prompt the user to enter the business details.</li><li>The user that registered the company should automatically be a part of the company.</li><li>A user must be able to join a company. <ul><li>They must be able to join using the company name.</li><li>They must be able to join using the company ID.</li><li>They must be able to join by using a dynamic link for joining that company.</li></ul></li><li>The system must allow the user to change for which company they are using the system (if they are part of multiple companies).</li></ul><h3 id="job-subsystem" tabindex="-1"><a class="header-anchor" href="#job-subsystem"><span>Job Subsystem</span></a></h3><ul><li>The system must be able to store information pertaining to a job.</li><li>The system must allow a job to have a status.</li><li>The system must provide default statuses: <ul><li>Todo - the job has not been started.</li><li>In progress - the job in being completed at the moment.</li><li>Paused - The job has been paused (for cases where jobs run over multiple days).</li><li>Awaiting sign off - the employee completed their part of the job. The job needs to be reviewed by a superior.</li><li>Awaiting invoice - an invoice needs to be sent (refer to the automatic invoicing system).</li><li>Awaiting payment - The invoice has been sent.</li><li>Completed - the payment has been received.</li></ul></li><li>The system must also allow the user to edit the statuses available on the system (refer to company settings subsystem).</li></ul><h4 id="view-job-subsystem" tabindex="-1"><a class="header-anchor" href="#view-job-subsystem"><span>View Job Subsystem</span></a></h4><ul><li>The system must show the user all the jobs they have access to. <ul><li>The user should be able to sort the jobs.</li><li>The user should be able to filter the jobs.</li><li>The user should be able to search for a job using any of the attributes associated with a job.</li></ul></li><li>The system must allow the user to view each job individually.</li><li>On each individual job, the system must provide a different view based on the status of the job.</li><li>If the job status is Todo: <ul><li>The system must show all the information pertaining to the job.</li><li>The user must be able to change the status to in progress.</li></ul></li><li>When the job status is In Progress: <ul><li>The user must be able to upload images of the job.</li><li>The user must be able to record details of the job.</li><li>The user must be able to record all the inventory they used.</li><li>The user must be able to change the status of the job to review (i.e., indicate that they are done).</li></ul></li><li>When the job status is Paused, the user must be able to resume the job.</li><li>When the job status is Awaiting invoice: <ul><li>The system must provide the user with a preview of the generated invoice.</li><li>The user must be able to edit the generated invoice.</li><li>The user must be able to download the invoice.</li><li>The user must be able to send the invoice to the client.</li><li>The user must be able to change the status of the job to Awaiting payment (i.e., indicate the invoice has been sent).</li></ul></li><li>When the job status is Awaiting payment: <ul><li>The system must display all the information pertaining to the job. This includes the details provided by the client, the details about the work added by the employees, and the invoice sent.</li><li>The user must be able to change the status of the job to complete (i.e., indicate the payment has been received).</li></ul></li><li>When the job status is Awaiting sign off: <ul><li>The user must be able to see all the information they added during the job.</li><li>The user must be able to leave comments.</li><li>The user must be able to see the comments.</li><li>The user must be able to edit the comments if they have permission (i.e., they worked on the job or they are a superior).</li><li>The user must be able to change the status of the job to complete (i.e., indicate the job has been signed off).</li></ul></li><li>When the job status is complete, the system must show an overview of the job.</li><li>At any point, the system must allow the user to access an overview of the job.</li></ul><h4 id="edit-job-subsystem" tabindex="-1"><a class="header-anchor" href="#edit-job-subsystem"><span>Edit Job Subsystem</span></a></h4><ul><li>Everything available for the View Job Subsystem must also be available to this subsystem.</li><li>The system must allow the user to create a job. <ul><li>The system must allow the user to enter the date the job was received.</li><li>The system must allow the user to enter the date on which the job must be complete.</li><li>The system must allow the user to enter the client for whom the job is. <ul><li>If the client does not exist, the user must be able to create a client and then create the job for that client.</li><li>The system must ensure that the client field is filled in.</li></ul></li><li>The system must allow the user to assign an employee or to leave the assignment for later.</li></ul></li><li>The system must allow the user to assign any jobs that have not been assigned when they were created.</li></ul><h3 id="client-subsystem" tabindex="-1"><a class="header-anchor" href="#client-subsystem"><span>Client Subsystem</span></a></h3><ul><li>The system must allow data pertaining to the user to be stored.</li></ul><h4 id="view-client-subsystem" tabindex="-1"><a class="header-anchor" href="#view-client-subsystem"><span>View Client Subsystem</span></a></h4><ul><li>The system must display all the clients the user has permission to view. <ul><li>The user must be able to sort the list of clients.</li><li>The user must be able to filter the list of clients.</li><li>The employee must be able to search for a particular client.</li></ul></li><li>The system must display all the jobs of a particular client that the user has permission to view.</li></ul><h4 id="edit-client-subsystem" tabindex="-1"><a class="header-anchor" href="#edit-client-subsystem"><span>Edit Client Subsystem</span></a></h4><ul><li>This subsystem must include everything available in the View Client Subsystem.</li><li>The system must allow the user to create new clients.</li><li>The user must be able to edit any of the information pertaining to a client that they have permission to edit.</li></ul><h3 id="inventory-subsystem" tabindex="-1"><a class="header-anchor" href="#inventory-subsystem"><span>Inventory Subsystem</span></a></h3><h4 id="on-the-job-inventory-subsystem" tabindex="-1"><a class="header-anchor" href="#on-the-job-inventory-subsystem"><span>On The Job Inventory Subsystem</span></a></h4><p>This is how anyone on site will be able to track the inventory they used.</p><ul><li>The system should allow any on-site employee to add an item to the list of items used for a job.</li><li>The user should be able to add multiple items at once.</li><li>The user should be able to remove any item they added.</li><li>Any inventory used must be updated in the company&#39;s inventory.</li><li>The user must also be able to log any job-specific orders.</li></ul><h4 id="view-inventory-subsystem" tabindex="-1"><a class="header-anchor" href="#view-inventory-subsystem"><span>View Inventory Subsystem</span></a></h4><ul><li>The subsystem must allow the user to view all the inventory items the company has, if the user has the relevant permission. <ul><li>The user must be able to search for a particular item.</li><li>The user must be able to sort the items.</li><li>The user must be able to filter the items.</li></ul></li><li>The system must highlight the items that are low in stock.</li></ul><h4 id="edit-inventory-subsystem" tabindex="-1"><a class="header-anchor" href="#edit-inventory-subsystem"><span>Edit Inventory Subsystem</span></a></h4><ul><li>Everything that is available to the View Inventory Subsystem must also be available for this subsystem.</li><li>The user should be able to add new items to the inventory: <ul><li>The system should allow the user to add all the information pertaining to the item.</li></ul></li><li>The user should be able to update an existing item. They must be able to edit any of the information for that item.</li><li>The user should be able to delete an item from the inventory.</li><li>The user should be able to conduct a stock take at the end of the day. <ul><li>The system should then generate a report based on the day.</li><li>The report should specify if there were any discrepancies in the amount of stock used and the stock take.</li></ul></li></ul><h3 id="communication-and-notification-subsystem" tabindex="-1"><a class="header-anchor" href="#communication-and-notification-subsystem"><span>Communication and Notification Subsystem</span></a></h3><h4 id="push-notifications" tabindex="-1"><a class="header-anchor" href="#push-notifications"><span>Push Notifications</span></a></h4><ul><li>All users of the system should receive push notifications regarding any important changes in the system that involve them.</li><li>Users should receive notifications when they are added to a job.</li><li>Users should receive notifications when the status of a job they have access to changes.</li><li>Users with appropriate permissions should receive notifications about any inventory that needs to be ordered.</li><li>The system should allow each user to change their notification settings.</li><li>Users with permission should receive notifications about any client feedback after the job has been completed.</li></ul><h4 id="sms-notifications" tabindex="-1"><a class="header-anchor" href="#sms-notifications"><span>SMS Notifications</span></a></h4><ul><li>Clients of the company must receive an SMS when an employee is on their way to complete a job.</li></ul><h4 id="emails" tabindex="-1"><a class="header-anchor" href="#emails"><span>Emails</span></a></h4><ul><li>The system should send an email to clients when an employee is on their way to complete a job.</li><li>The system should have the option to automatically email an invoice to a client.</li><li>The system should send an email to clients with a link to be able to fill in a feedback form.</li><li>The settings for emails must be changeable.</li></ul><h3 id="reporting-subsystem" tabindex="-1"><a class="header-anchor" href="#reporting-subsystem"><span>Reporting Subsystem</span></a></h3><ul><li>The system should be able to generate analytics: <ul><li>The system must generate analytics about the inventory system.</li><li>The system must generate analytics about the clients of the business. The system should include any client feedback.</li><li>The system must generate analytics about the employees of the business. <ul><li>The system should provide these reports to the users based on their role in the company.</li><li>If there is no one under a particular employee, the system should only show a report of the user&#39;s own performance.</li><li>If there is someone working under the user, then the system should show analytics for everyone and everything under that user.</li></ul></li></ul></li><li>The system must be able to automatically generate a report of those analytics.</li></ul><h3 id="feedback-subsystem" tabindex="-1"><a class="header-anchor" href="#feedback-subsystem"><span>Feedback Subsystem</span></a></h3><ul><li>This system is intended to gather feedback from clients.</li><li>The system must provide a feedback form for each client for each job that has been completed.</li></ul><h3 id="automated-job-assignment-subsystem" tabindex="-1"><a class="header-anchor" href="#automated-job-assignment-subsystem"><span>Automated Job Assignment Subsystem</span></a></h3><p>This is added as a potential wow factor.</p><ul><li>This subsystem should automatically suggest an employee to which the job should be assigned when the job is being created.</li><li>The system should make these recommendations based on the availability of the employees, spread of jobs amongst all employees, skill level of an employee, and location of the job.</li></ul>',50),o=[a];function n(h,u){return s(),t("div",null,o)}const m=e(l,[["render",n],["__file","functionalRequirements.html.vue"]]),b=JSON.parse('{"path":"/businessDocs/functionalRequirements.html","title":"Functional Requirements","lang":"en-US","frontmatter":{"pageClass":"functionalDoc"},"headers":[{"level":3,"title":"Authorization and Authentication Subsystem","slug":"authorization-and-authentication-subsystem","link":"#authorization-and-authentication-subsystem","children":[]},{"level":3,"title":"Roles and Permissions","slug":"roles-and-permissions","link":"#roles-and-permissions","children":[]},{"level":3,"title":"Employee Subsystem","slug":"employee-subsystem","link":"#employee-subsystem","children":[]},{"level":3,"title":"Settings Subsystem","slug":"settings-subsystem","link":"#settings-subsystem","children":[]},{"level":3,"title":"Company Subsystem","slug":"company-subsystem","link":"#company-subsystem","children":[]},{"level":3,"title":"Job Subsystem","slug":"job-subsystem","link":"#job-subsystem","children":[]},{"level":3,"title":"Client Subsystem","slug":"client-subsystem","link":"#client-subsystem","children":[]},{"level":3,"title":"Inventory Subsystem","slug":"inventory-subsystem","link":"#inventory-subsystem","children":[]},{"level":3,"title":"Communication and Notification Subsystem","slug":"communication-and-notification-subsystem","link":"#communication-and-notification-subsystem","children":[]},{"level":3,"title":"Reporting Subsystem","slug":"reporting-subsystem","link":"#reporting-subsystem","children":[]},{"level":3,"title":"Feedback Subsystem","slug":"feedback-subsystem","link":"#feedback-subsystem","children":[]},{"level":3,"title":"Automated Job Assignment Subsystem","slug":"automated-job-assignment-subsystem","link":"#automated-job-assignment-subsystem","children":[]}],"git":{"updatedTime":1717183057000,"contributors":[{"name":"JessicaBloem","email":"jessicabloem8@gmail.com","commits":1}]},"filePathRelative":"businessDocs/functionalRequirements.md"}');export{m as comp,b as data};
