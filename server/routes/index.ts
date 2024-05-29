export default [
  {
    method: 'GET',
    path: '/',
    handler: 'dataBackup.index',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'POST',
    path: '/create',
    handler: 'dataBackup.create',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'GET',
    path: '/listFiles',
    handler: 'dataBackup.listFiles',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'GET',
    path: '/listFilesWithDetails',
    handler: 'dataBackup.listFilesWithDetails',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'DELETE',
    path: '/deleteFile/:name',
    handler: 'dataBackup.delete',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'GET',
    path: '/download/:name',
    handler: 'dataBackup.download',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'GET',
    path: '/restore/:name',
    handler: 'dataBackup.restore',
    config: {
      policies: [],
      auth: false
    },
  },

  {
    method: 'POST',
    path: '/restoreBackup',
    handler: 'dataBackup.restoreBackup',
    config: {
      policies: [],
      auth: false
    },
  },
];
