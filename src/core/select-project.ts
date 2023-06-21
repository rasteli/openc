import fs from "fs"
import inquirer from "inquirer"
import { exec } from "child_process"
import { colors } from "../tokens/colors"

interface SelectProjectParams {
  www: string
}

interface SelectProjectAnswers {
  project: string
}

let message = "Select a project"

export async function selectProject({ www }: SelectProjectParams) {
  let projects = fs.readdirSync(www)
  const rootConditions = ["index", "main", "src", "config", "package"]

  const answers = await inquirer.prompt<SelectProjectAnswers>({
    type: "list",
    name: "project",
    message,
    choices: projects
  })

  www = `${www}/${answers.project}`
  projects = fs.readdirSync(www)
  message = `Select a project in ${colors.red}${answers.project}${colors.reset}`

  const isRoot = projects.some(value => {
    return rootConditions.some(condition => {
      return value.includes(condition)
    })
  })

  if (!isRoot) {
    await selectProject({ www })
  } else {
    exec(`code ${www}`)
  }
}
