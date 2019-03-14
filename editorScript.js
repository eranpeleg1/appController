let _editorSDK;
let _token;

module.exports = {

  editorReady: async (editorSDK, token, {firstInstall}) => {

    _editorSDK = editorSDK;
    _token = token;

    if (firstInstall || !await controllerAlreadyExists('myFirstApp')) {
      console.log('Creating missing controller!');

      const applicationId = await editorSDK.info.getAppDefinitionId(token);
      const pageRef = await editorSDK.pages.getCurrent(token);
      await editorSDK.components.add(token, {
        componentDefinition: {
          componentType: 'platform.components.AppController',
          data: {
            type: 'AppController',
            controllerType: 'myFirstApp',
            applicationId,
            settings: JSON.stringify({})
          }
        },
        pageRef
      });
    }
  },

  onEvent: async ({eventType, eventPayload}) => {
    const {controllerRef} = eventPayload;
    if (eventType === 'controllerSettingsButtonClicked') {
      const options = {
        title: 'Manage My First Application',
        url: './settings.html',
        initialData: {
          controllerRef
        },
        width: '80%',
        height: '80%'
      };
      await _editorSDK.editor.openComponentPanel(_token, {
        ...options,
        componentRef: controllerRef
      });
    }
  },

  getAppManifest: () => {
    return {
      controllersStageData: {
        myFirstApp: {
          default: {
            mainAction1: {
              label: 'Manage My First App'
            }
          }
        }
      },
      exports: {
        myFirstApp: {
          tagname: 'myFirstApp',
          widgetDisplayName: '',
          eventHandlers: {},
          synthetic: false,
          inherits: {},
          members: {
            randomize: {
              description: 'Randomize image sources',
              kind: 'function'
            }
          }
        }
      }
    };
  }

};

async function controllerAlreadyExists(controllerType) {
  const controllers = await _editorSDK.controllers.listAllControllers(_token);
  for (const controller of controllers) {
    const data = await _editorSDK.controllers.getData(_token, controller);
    if (data.controllerType === controllerType) {
      return true;
    }
  }
  return false;
}
