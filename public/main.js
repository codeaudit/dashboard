function delete_experiment (name) {
    // body... 
    axios({
        method: "delete",
        url: '/experiments',
        data: {name}
    })
    location.reload()
}