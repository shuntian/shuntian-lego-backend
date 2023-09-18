const { Controller } = require('egg');
const sharp = require('sharp');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const { nanoid } = require('nanoid');
const { extname, join } = require('path');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');

class UtilsController extends Controller {

  async uploadToOSS() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    // shuntian-lego /imooc-test/**.ext
    const saveOssPath = join('imooc-test', nanoid(6) + extname(stream.filename));

    try {
      const result = await ctx.oss.put(saveOssPath, stream);
      const { name, url } = result;
      ctx.helper.success({ ctx, res: { name, url } });
    } catch (e) {
      await sendToWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }

  }

  async uploadMultipart() {
    const { ctx } = this;
    const parts = ctx.multipart();
    const urls = [];
    let part = null;
    while ((part = await parts())) {
      if (Array.isArray(part)) continue;
      try {
        const saveOssPath = join('imooc-test', nanoid(6) + extname(part.filename));
        const result = await ctx.oss.put(saveOssPath, part);
        const { url } = result;
        urls.push(url);
      } catch (e) {
        console.log(e);
        await sendToWormhole(part);
        ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
        return;
      }
    }
    ctx.helper.success({ ctx, res: { urls } });
  }

  async fileLocalUpload() {
    const { ctx, app } = this;
    const { filepath } = ctx.request.files[0];
    // replace file url
    const imageSource = sharp(filepath);
    const metaData = await imageSource.metadata();
    let thumbnailUrl = '';
    if (metaData.width && metaData.width > 300) {
      const { name, ext, dir } = path.parse(filepath);
      const thumbnailFilePath = path.join(dir, `${name}-thumbnail${ext}`);
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath);
      thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
    }
    const url = filepath.replace(app.config.baseDir, app.config.baseUrl);
    ctx.helper.success({ ctx, res: { url, thumbnailUrl } });
  }

  pathToUrl(filepath) {
    const { app } = this;
    return filepath.replace(app.config.baseDir, app.config.baseUrl);
  }

  async fileUploadStream() {
    const { ctx, app } = this;
    const stream = await this.ctx.getFileStream();
    // uploads/***.ext
    // uploads/***_thumbnail.ext
    const uid = nanoid(6);
    const savedFilePath = path.join(app.config.baseDir, 'uploads', uid + extname(stream.filename));
    const savedThumbnailFilePath = path.join(app.config.baseDir, 'uploads', uid + '_thumbnail' + extname(stream.filename));
    const target = createWriteStream(savedFilePath);
    const target2 = createWriteStream(savedThumbnailFilePath);
    const savePromise = pipeline(stream, target);

    const transform = sharp().resize({ width: 300 });
    const saveThumbnailPromise = pipeline(stream, transform, target2);

    try {
      await Promise.all([ savePromise, saveThumbnailPromise ]);
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }

    ctx.helper.success({ ctx, res: {
      url: this.pathToUrl(savedFilePath),
      thumbnailUrl: this.pathToUrl(savedThumbnailFilePath),
    } });
  }

}

module.exports = UtilsController;
