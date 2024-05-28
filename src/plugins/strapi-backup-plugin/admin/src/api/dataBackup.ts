import { request } from "@strapi/helper-plugin";

const dataBackupRequests = {
    create: async (name:string) => {
      try {
        return await request(`/strapi-backup-plugin/create`, {
          method: "POST",
          body: { data: {name : name} },
        });
      } catch (error) {
        throw error;
      }
    },

    listFilesWithDetails: async () => {
     try {
      return await request(`/strapi-backup-plugin/listFilesWithDetails`, {
        method: "GET"
      });
     } catch (error) {
      throw error;
     }
    },

    deleteFile: async (name:string) => {
      try {
        return await request(`/strapi-backup-plugin/deleteFile/${name}`, {
          method: "DELETE",
        });
      } catch (error) {
        throw error;
      }
    },

    downloadFile: async (name:string) => {
      try {
        return await request(`/strapi-backup-plugin/download/${name}`, {
          method: "GET",
        });
      } catch (error) {
        throw error;
      }
    },

    restoreFile: async (name:string) => {
      try {
        return await request(`/strapi-backup-plugin/restore/${name}`, {
          method: "GET",
        });
      } catch (error) {
        throw error;
      }
    }
}

export {dataBackupRequests};