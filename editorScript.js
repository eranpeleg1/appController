module.exports = {
    editorReady: async (editorSDK, token, {firstInstall}) => {
        if (firstInstall) {
            console.log('installing');
            const componentRefs = await editorSDK.components.gelAllComponents()
            const result = await editorSDK.components.get(token, {componentRefs, properties: ['nickname']})
            console.log('result: ', result)
        }
    }
}
