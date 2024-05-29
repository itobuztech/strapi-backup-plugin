import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-backup-plugin')
      .service('myService')
      .getWelcomeMessage();
  },

  async create(ctx) {
    try {
      ctx.body = await strapi
            .plugin("strapi-backup-plugin")
            .service("myService")
            .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async listFiles(ctx) {
    try {
      return await strapi.plugin("strapi-backup-plugin").service("myService").listFiles();
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async listFilesWithDetails(ctx) {
    try {
      return await strapi.plugin("strapi-backup-plugin").service("myService").listFilesWithDetails();
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async delete(ctx) {
    try {
      return await strapi.plugin("strapi-backup-plugin").service("myService").delete(ctx.params.name);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async download(ctx) {
    try {
      return await strapi.plugin("strapi-backup-plugin").service("myService").download(ctx.params.name);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async restore(ctx){
    try {
      return await strapi.plugin("strapi-backup-plugin").service("myService").restore(ctx.params.name);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async restoreBackup(ctx) {
    try {
      ctx.body = await strapi
            .plugin("strapi-backup-plugin")
            .service("myService")
            .restoreBackup(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // async restoreBackup(ctx) {
  //   try {
  //     return await strapi.plugin("strapi-backup-plugin").service("myService").restoreBackup(ctx.params.text);
  //   } catch (err) {
  //     ctx.throw(500, err);
  //   }
  // },
});
