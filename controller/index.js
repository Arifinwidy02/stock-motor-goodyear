const { motor, status, Sequelize, repair } = require("../models");
const { sequelize } = require("../models");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");

class Controller {
  static async allStatus(req, res, next) {
    try {
      const data = await status.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async motors(req, res, next) {
    const sortName = req.query.sortName;
    const sortByType = req.query.sortByType;
    const optionalFetching = req.query.id_number
      ? {
          where: {
            isHiddenMotor: false,
            id_number: {
              [Sequelize.Op.iLike]: `%${req.query.id_number}%`,
            },
          },
          order: [["id_number", "DESC"]],
          include: [status],
        }
      : sortName
      ? {
          where: {
            isHiddenMotor: false,
          },
          order: [[sortName, sortByType]],
          include: [status],
        }
      : {
          where: {
            isHiddenMotor: false,
          },
          order: [["id_number", "DESC"]], // Default sorting column, change as needed
          include: [status],
        };

    try {
      const data = await motor.findAll(optionalFetching);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async allRepair(req, res, next) {
    try {
      const data = await repair.findAll({ include: [status, motor] });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async registerMotor(req, res, next) {
    try {
      const body = {
        id_number: req.body.id_number,
        remarks: req.body.remarks,
        manufacturer: req.body.manufacturer,
        voltage: +req.body.voltage,
        hp: +req.body.hp,
        ac_dc: req.body.ac_dc,
        statusId: +req.body.statusId,
        imgUrl: req.body.imgUrl,
        isHiddenMotor: false,
      };

      const createdMotor = await motor.create(body);

      // // Generate and store the QR code using the 'id'
      const qrcodeData = `${createdMotor.id}`; // Adjust as needed
      const qrcodePng = await generateQRCode(qrcodeData);

      // // Update the created motor with the QR code
      await motor.update(
        { qrcode: qrcodePng.toString("base64") },
        { where: { id: createdMotor.id } }
      );
      if (+createdMotor.statusId == 3) {
        const body = {
          order_date: new Date(),
          motorId: createdMotor?.id,
          statusId: createdMotor?.statusId,
        };
        await repair.create(body);
      }

      res.status(200).json({
        message: `success add new motor`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async isHiddenMotor(req, res, next) {
    try {
      const motors = await motor.findByPk(req.params.id);
      // Toggle the value of isActive
      const updatedIsHidden = !motors.isHiddenMotor;

      await motor.update(
        { isHiddenMotor: updatedIsHidden },
        { where: { id: req.params.id } }
      );
      res.status(200).json({
        message: `success delete motor`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async editMotor(req, res, next) {
    try {
      const motors = await motor.findByPk(req.params.id);
      const body = {
        id_number: req.body.id_number,
        remarks: req.body.remarks,
        manufacturer: req.body.manufacturer,
        voltage: +req.body.voltage,
        hp: +req.body.hp,
        ac_dc: req.body.ac_dc,
        statusId: +req.body.statusId, //+motors.statusId,
        imgUrl: req.body.imgUrl,
        isHiddenMotor: false,
      };

      const updatedMotor = await motor.update(body, {
        where: { id: req.params.id },
      });
      if (+req.body.statusId == 3) {
        const body = {
          order_date: new Date(),
          motorId: +motors?.id,
          statusId: +req.body.statusId,
        };
        await repair.create(body);
      }
      if (+req.body.statusId == 1 && motors.statusId == 3) {
        const body = {
          finish_date: new Date(),
          statusId: +req.body.statusId,
        };

        await repair.update(body, {
          where: { motorId: motors.id, statusId: 3 },
        });
      }
      res.status(200).json({
        message: `success update motor`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async findMotorById(req, res, next) {
    try {
      const motors = await motor.findByPk(req.params.id);
      res.status(200).json(motors);
    } catch (error) {
      next(error);
    }
  }
  static async changeStatus(req, res, next) {
    const qrCode = req.body.qrcode;
    try {
      const findMotor = await motor.findOne({ where: { qrcode: qrCode } });
      await findMotor.update(
        { statusId: +req.body.statusId },
        { where: { id: findMotor.id } }
      );
      if (+req.body.statusId == 3) {
        const body = {
          order_date: new Date(),
          motorId: findMotor?.id,
          statusId: findMotor?.statusId,
        };
        await repair.create(body);
      }
      if (+req.body.statusId == 1) {
        const body = {
          finish_date: new Date(),
          statusId: +findMotor?.statusId,
        };

        await repair.update(body, {
          where: { motorId: findMotor.id, statusId: 3 },
        });
      }
      res.status(200).json({
        message: `success change status motor with id_number ${findMotor?.id_number}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Helper function to generate a QR code
async function generateQRCode(data) {
  try {
    const buffer = await QRCode.toBuffer(data);
    return buffer;
  } catch (error) {
    throw error;
  }
}

// Helper function to generate a barcode
async function generateBarcode(data) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128", // or other barcode types
        text: data,
        scale: 3,
        height: 10,
        width: 40,
        includeText: true,
        textxalign: "center",
      },
      (err, png) => {
        if (err) reject(err);
        else resolve(png);
      }
    );
  });
}

module.exports = Controller;
