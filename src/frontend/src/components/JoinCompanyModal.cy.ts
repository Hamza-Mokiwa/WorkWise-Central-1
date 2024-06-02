import { createVuetify } from 'vuetify'
import { mount } from 'cypress/vue'
import JoinCompanyModal from "./JoinCompanyModal.vue"

it("renders client detials", () => {
    const vuetify = createVuetify();
    mount(JoinCompanyModal, {
        global: {
        plugins: [vuetify]
        }
    })
    cy.contains('Join Company')
    // cy.contains('Name of client')
    // cy.contains('Client email address')
    // cy.contains('Client phone number')
    // cy.contains('Client address')
    // cy.contains('Company (if applicable)')
    // cy.contains('Company address (if applicable)')
    // cy.contains('Preferred language')
});

it("click create client button", () => {
    const vuetify = createVuetify();
    mount(JoinCompanyModal, {
        global: {
        plugins: [vuetify]
        }
    })

    cy.contains('button','create client').click()
});
