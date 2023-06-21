import os from "os"
import fs from "fs"
import inquirer from "inquirer"
import { createProject } from "./core/create-project"
import { selectProject } from "./core/select-project"

async function main(www: string) {
  const answers = await inquirer.prompt({
    type: "list",
    name: "type",
    message: "Create/Select project",
    choices: ["Create", "Select"]
  })

  if (answers.type === "Create") {
    await createProject({ www })
  } else {
    await selectProject({ www })
  }
}

const homeDir = os.homedir()

if (!fs.existsSync(`${homeDir}/www`)) {
  fs.mkdirSync(`${homeDir}/www`)
}

;(async () => {
  await main(`${homeDir}/www`)
})()
