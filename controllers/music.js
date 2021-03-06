/**
 * 音乐相关控制逻辑
 */
const path = require('path')
const { Router } = require('express')
const formidable = require('formidable')
const Music = require('../models/music')
const router = module.exports = Router()
router.prefix = '/admin/music'

/**
 * GET /admin/music/list
 */
router.get('/list', (req, res) => {
  res.locals.list = Music.find()
  res.render('music/list')
})

/**
 * GET /admin/music/add
 */
router.get('/add', (req, res) => {
  res.render('music/add')
})

/**
 * POST /admin/music/add
 */
router.post('/add', (req, res) => {
  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(__dirname, '../www/uploads')
  form.keepExtensions = true
  form.parse(req, (error, fields, files) => {
    if (error) throw error
    // 接收到客户端提交过来文件和填写的信息
    let id = 0
    Music.find().forEach(m => { if (m.id > id) id = m.id })
    // 此时不能保存完整路径
    const music = new Music(
      id + 1,
      fields.name,
      fields.artist,
      fields.duration,
      path.basename(files.music.path),
      path.basename(files.poster.path),
      path.basename(files.lyric.path)
    )
    music.save()
    res.redirect('/admin/music/list')
  })
})

/**
 * GET /admin/music/edit/:id
 */
router.get('/edit/:id', (req, res) => {
    // 接收传过来的ID
  const id = parseInt(req.params.id || 0)
  if (!id) {
    // 不存在这个数据
    return res.status(404).send('没有该记录')
  }
  // 找到数组中的这个元素删除
  const temp = Music.findOne(id)
  if (!temp) {
    // 不存在这个数据
    return res.status(404).send('没有该记录')
  }
  res.locals.item = temp
  res.render('music/edit')
})

/**
 * POST /admin/music/edit/:id
 */
router.post('/edit/:id', (req, res) => {
  // 接收传过来的ID
  const id = parseInt(req.params.id || 0)
  if (!id) {
    // 不存在这个数据
    return res.status(404).send('没有该记录')
  }
  // 找到数组中的这个元素删除
  const temp = Music.findOne(id)
  if (!temp) {
    // 不存在这个数据
    return res.status(404).send('没有该记录')
  }
  temp.name = req.body.name
  temp.artist = req.body.artist
  if (!temp.update()) {
    res.locals.item = temp
    res.render('music/edit')
  }
  res.redirect('/admin/music/list')
})

/**
 * GET /admin/music/delete/:id
 */
router.get('/delete/:id', (req, res) => {
  // 接收传过来的ID
  const id = parseInt(req.params.id || 0)
  if (!id) {
    // 不存在这个数据
    return res.status(404).send('没有该记录')
  }
  // 找到数组中的这个元素删除
  const temp = Music.findOne(id)
  if (!temp) {
    // 不存在这个数据
    return res.status(404).send('没有该记录')
  }
  // 数据存在，需要删除
  temp.delete()
  res.redirect('/admin/music/list')
})
