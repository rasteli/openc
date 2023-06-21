import os from "node:os"
import fs from "node:fs"
import path from "node:path"
import inquirer from "inquirer"
import { createProject } from "./services/create-project"
import { selectProject } from "./services/select-project"

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
    await selectProject({ www, basename: path.basename(www) })
  }
}

const homeDir = os.homedir()

if (!fs.existsSync(`${homeDir}/www`)) {
  fs.mkdirSync(`${homeDir}/www`)
}

;(async () => {
  await main(`${homeDir}/www`)
})()
