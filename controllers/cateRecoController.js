const certRecoModel = require("../models/certRecoModel");

// 카테고리별 자격증 추천 컨트롤러
exports.getCategoryRecommendations = async (req, res) => {
  const { category } = req.params;
  console.log('Category received:', category);
  try {
    const recommendations = await certRecoModel.getCertsByCategory(category);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching category recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};