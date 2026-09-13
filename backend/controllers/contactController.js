import pool from '../config/db.js'

export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject and message are required.',
      })
    }

    const [result] = await pool.execute(
      `INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, phone || null, subject, message],
    )

    return res.status(201).json({
      success: true,
      message: 'Contact message sent successfully.',
      data: {
        id: result.insertId,
      },
    })
  } catch (error) {
    console.error('Contact save failed:', error)
    return next(error)
  }
}

export default createContactMessage
