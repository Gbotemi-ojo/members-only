const sign_up = require("../controllers/sign_up_controller");
const sign_in = require("../controllers/sign_in_controller");
const message_controller = require("../controllers/message_controller");
const profile_pic = require("../controllers/profile_pic_controller");
const club_controller = require("../controllers/club_controller");
const admin_controller = require("../controllers/admin_controller")
const express = require("express");
const router = express.Router();

const multer = require('multer');
const upload = multer(
    {
        dest: './public/images/uploads/',
        limits: { fileSize: 2000000 }
    });

router.get("/", sign_in.index);
router.get("/sign_up", sign_up.sign_up_form_get);
router.post("/sign_up", upload.single("myImage"), sign_up.sign_up_form_post);

router.get("/sign_in", sign_in.sign_in_form_get);
router.post("/sign_in", sign_in.sign_in_form_post);

router.get("/sign_out", sign_in.sign_out);

router.get("/create_message", message_controller.message_form_get);
router.post("/create_message", message_controller.message_form_post);

router.get("/profile_picture", profile_pic.get_profile_pic_form);
router.post("/profile_picture", upload.single("myImage"), profile_pic.upload_profile_pic);

router.get("/join_club", club_controller.club_form_get);
router.post("/join_club", club_controller.club_form_post);

router.get("/admin", admin_controller.admin_form_get);
router.post("/admin", admin_controller.admin_form_post);

module.exports = router;
