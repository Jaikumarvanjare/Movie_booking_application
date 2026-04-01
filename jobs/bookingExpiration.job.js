const cron = require('node-cron');

const prisma = require('../utils/prismaClient');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');

const bookingExpirationJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log("⏰ Running booking expiration cron...");

    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: BOOKING_STATUS.processing,
          createdAt: {
            lte: tenMinutesAgo
          }
        },
        include: {
          payment: true
        }
      });

      for (let booking of expiredBookings) {

        if (booking.payment && booking.payment.status === PAYMENT_STATUS.pending) {

          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: BOOKING_STATUS.expired
            }
          });

          await prisma.payment.update({
            where: { bookingId: booking.id },
            data: {
              status: PAYMENT_STATUS.failed
            }
          });

          console.log(`❌ Booking expired: ${booking.id}`);
        }
      }

    } catch (error) {
      console.error("❌ Cron error:", error);
    }
  });
};

module.exports = bookingExpirationJob;