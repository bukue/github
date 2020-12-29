export const checkForOk = (result) => {
    if(!result.ok){
        throw result.json();
    }

    return result.json();
}

export const catchErrors = (error) => {
    error.then( data =>{
        alert(`Fetching data failed: ${data.message} For more information visit: ${data.documentation_url}`);
    })
}

export const lastCommitsUsers = (data) => {
    return Array.from(
        new Set(
            data.map(record => record.commit.author.name)
        )
    );
}