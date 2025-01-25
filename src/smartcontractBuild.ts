import * as path from "path";
import { exec } from "child_process";

const VSCODE_PATH = "code";

function launchSmartContractTemplate(contractType: string): string {
    const templatesDirectory = "smart_contracts";

    const templateMapping: Record<string, string> = {
        ERC20: "ERC20.sol",
        ERC721: "ERC721.sol",
        ERC1155: "ERC1155.sol"
    };

    if (contractType in templateMapping) {
        const templateFilename = templateMapping[contractType];
        const templatePath = path.join(templatesDirectory, templateFilename);

        exec(`${VSCODE_PATH} ${templatePath}`);
        return "Smart contract template launched in Visual Studio Code. You can start editing now!";
    } else {
        return "Invalid contract type. Please choose a valid contract type.";
    }
}

function promptContractType(): string | null {
    const contractTypes = ["ERC20", "ERC721", "ERC1155"];
    console.log("Available contract types:");
    console.log("1. ERC20");
    console.log("2. ERC721");
    console.log("3. ERC1155");
    console.log("0. Quit");

    const userInput = prompt("Ella: Please enter the corresponding number: ");

    if (userInput === "0") {
        return null;
    }

    const index = parseInt(userInput, 10) - 1;

    if (!isNaN(index) && index >= 0 && index < contractTypes.length) {
        return contractTypes[index];
    } else {
        console.log("Invalid input. Please enter a valid number.");
        return promptContractType();
    }
}

function main(): void {
    while (true) {
        const contractType = promptContractType();

        if (contractType === null) {
            break;
        }

        const response = launchSmartContractTemplate(contractType);
        console.log(response);
    }
}

main();
