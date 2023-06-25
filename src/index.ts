#!/usr/bin/env node
import os from "node:os"
import fs from "node:fs"
import path from "node:path"
import inquirer from "inquirer"
import { createProject } from "./services/create-project"
import { selectProject } from "./services/select-project"

inquirer.registerPrompt("search-list", require("inquirer-search-list"))

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
    await selectProject({ www, basename: path.basename(www), index: 0 })
  }
}

const homeDir = os.homedir()
const defaultDir = `${homeDir}/www`

if (!fs.existsSync(defaultDir)) {
  fs.mkdirSync(defaultDir)
}

;(async () => {
  await main(defaultDir)
})()
