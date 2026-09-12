import express from 'express'

const router = express.Router()

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Project listings ready for future MySQL integration.',
  })
})

router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.params.id,
      title: 'Project placeholder',
    },
    message: 'Single project endpoint ready for future database integration.',
  })
})

export default router
