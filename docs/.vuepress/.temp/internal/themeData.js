export const themeData = JSON.parse("{\"locales\":{\"/\":{\"lang\":\"en-US\",\"selectLanguageName\":\"English\"},\"/zh/\":{\"lang\":\"zh-CN\"}},\"navbar\":[{\"text\":\"Home\",\"link\":\"/\"},{\"text\":\"Docs\",\"link\":\"/guide/\"},{\"text\":\"GitHub\",\"link\":\"https://github.com/COS301-SE-2024/WorkWise-Central\"},{\"text\":\"Figma\",\"link\":\"https://www.figma.com/design/A2DXLoJH7QvZ6RzI711zUC/WorkWise?node-id=0-1&t=mAFPbit2in8F1o5m-0\"}],\"sidebar\":[{\"text\":\"Introduction\",\"prefix\":\"/guide/\",\"link\":\"/guide/\"},{\"text\":\"Design Documentation\",\"prefix\":\"/designDocs/\",\"link\":\"/designDocs/\",\"children\":[{\"text\":\"Wireframes\",\"link\":\"/designDocs/wireframes.md\"},{\"text\":\"Class diagrams\",\"link\":\"/designDocs/classDiagrams.md\"}]},{\"text\":\"Business Documentation\",\"prefix\":\"/businessDocs/\",\"link\":\"/businessDocs/\",\"children\":[{\"text\":\"User characteristics\",\"link\":\"/businessDocs/userCharacteristics.md\"},{\"text\":\"User stories\",\"link\":\"/businessDocs/userStories.md\"},{\"text\":\"Use case diagrams\",\"link\":\"/businessDocs/usecaseDiagrams.md\"},{\"text\":\"Functional requirement specifications\",\"link\":\"/businessDocs/functionalRequirements.md\"},{\"text\":\"Service contract\",\"link\":\"/businessDocs/serviceContract.md\"},{\"text\":\"Market Research\",\"link\":\"/businessDocs/marketResearch.md\"}]},{\"text\":\"Architetural Documentation\",\"prefix\":\"/architeturalDocs/\",\"link\":\"/architeturalDocs/\",\"children\":[{\"text\":\"Quality Requirements\",\"link\":\"/architeturalDocs/qualityRequirements.md\"},{\"text\":\"Architectural Patterns and Design Patterns\",\"link\":\"/architeturalDocs/architecturalPatterns.md\"},{\"text\":\"Constraints\",\"link\":\"/architeturalDocs/constraints.md\"},{\"text\":\"Technology Requirements\",\"link\":\"/architeturalDocs/techSpec.md\"}]},{\"text\":\"Database Documentation\",\"prefix\":\"/databaseDocs/\",\"link\":\"/databaseDocs/\",\"children\":[{\"text\":\"Database functional requirements\",\"link\":\"/databaseDocs/dbFunctionalRequirements.md\"},{\"text\":\"Database non-functional requirements\",\"link\":\"/databaseDocs/dbNonFunctionalRequirements.md\"},{\"text\":\"Constraints\",\"link\":\"/databaseDocs/constraints.md\"},{\"text\":\"Data Model\",\"link\":\"/databaseDocs/dataModel.md\"},{\"text\":\"ER Diagram\",\"link\":\"/databaseDocs/ERDiagrams.md\"},{\"text\":\"Database Schema\",\"link\":\"/databaseDocs/dbSchema.md\"}]},{\"text\":\"DevOps\",\"prefix\":\"/devOps/\",\"link\":\"/devOps/\",\"children\":[{\"text\":\"Git originisation and management\",\"link\":\"/devOps/gitOrgMan.md\"},{\"text\":\"Branching Strategy\",\"link\":\"/devOps/branching.md\"},{\"text\":\"CI/CD\",\"link\":\"/devOps/cicd.md\"}]}],\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
