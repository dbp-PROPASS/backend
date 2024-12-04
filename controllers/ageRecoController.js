const certRecoModel = require("../models/certRecoModel");

// 연령대별 자격증 추천 컨트롤러
exports.getAgeGroupRecommendations = async (req, res) => {
  const { age_group } = req.params;
  console.log('AgeGroup received:', age_group);
  try {
    const recommendations = await certRecoModel.getCertsByAgeGroup(age_group);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching age group recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};