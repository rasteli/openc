import fs from "node:fs"

export function checkRootDir(projectPath: string) {
  const rootConditions = ["index", "main", "src", "config", "package"]
  const projects = fs.readdirSync(projectPath)

  const isRoot = projects.some(value => {
    return rootConditions.some(condition => {
      return value.includes(condition)
    })
  })

  return isRoot
}
