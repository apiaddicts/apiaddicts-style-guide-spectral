module.exports = (targetVal, paths) => {
    let content = typeof targetVal === "object" ? JSON.stringify(targetVal, null, 2) : String(targetVal);

    const lines = content.split(/\r\n|\r|\n/);

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "") {
            return [{
                message: `OAR043: Se encontró una línea vacía en la línea ${i + 1}.`,
                path: paths.target
            }];
        }
    }

    return [];
};