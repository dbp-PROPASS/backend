const express = require("express");
const router = express.Router();
const { getCategoryRecommendations } = require("../controllers/cateRecoController");
const { getAgeGroupRecommendations } = require("../controllers/ageRecoController");

// 카테고리별 추천 자격증 라우트
router.get("/category/:category", getCategoryRecommendations);

// 연령대별 추천 자격증 라우트
router.get("/ageGroup/:age_group", getAgeGroupRecommendations);

module.exports = router;