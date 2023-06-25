import fs from "node:fs"
import path from "node:path"
import inquirer from "inquirer"
import { exec } from "node:child_process"
import { colors } from "../tokens/colors"
import { checkRootDir } from "../utils/check-root-dir"

interface SelectProjectParams {
  index: number
  www: string
  basename: string
}

interface SelectProjectAnswers {
  project: string
  todo: string
  confirmRemove: boolean
}

export async function selectProject({
  www,
  basename,
  index
}: SelectProjectParams) {
  const isChild = index > 0
  const choices = fs.readdirSync(www)

  const answers = await inquirer.prompt<SelectProjectAnswers>([
    {
      type: "search-list",
      name: "project",
      message: `Select a project in ${colors.red}${basename}${colors.reset}`,
      choices: isChild ? ["..", ...choices] : choices
    },
    {
      type: "list",
      name: "todo",
      message: "What do you want to do?",
      choices: ["Open", "Remove"],
      when: ({ project }) => {
        const path = `${www}/${project}`
        return checkRootDir(path)
      }
    },
    {
      type: "confirm",
      name: "confirmRemove",
      message: "Are you sure?",
      default: false,
      when: ({ todo }) => todo === "Remove"
    }
  ])

  if (isChild && answers.project === "..") {
    const parentDir = path.resolve(www, "..")

    await selectProject({
      www: parentDir,
      basename: path.basename(parentDir),
      index: index - 1
    })
    return
  }

  const projectPath = `${www}/${answers.project}`
  const isRoot = checkRootDir(projectPath)

  if (!isRoot) {
    await selectProject({
      www: projectPath,
      basename: answers.project,
      index: index + 1
    })
    return
  }

  if (answers.confirmRemove) {
    fs.rmSync(projectPath, { recursive: true, force: true })
    console.log(`${colors.red}${answers.project}${colors.reset} removed`)

    await selectProject({ www, basename: path.basename(www), index })
    return
  }

  exec(`code ${projectPath}`)
}
