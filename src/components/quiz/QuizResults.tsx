import { type ConfettiRef } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import confetti from "canvas-confetti";
import { Activity, AlertTriangle, Brain, CheckCircle, Clock, Download, Droplets, Heart, Mail, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QuizData } from "../HealthQuiz";

interface QuizResultsProps {
  data: QuizData;
}

interface RiskScore {
  category: string;
  score: number;
  risk: "low" | "moderate" | "high";
  icon: React.ReactNode;
  recommendations: string[];
  description: string;
}

export const QuizResults = ({ data }: QuizResultsProps) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const confettiRef = useRef<ConfettiRef>(null);


  // Calculate risk scores (keeping existing logic)
  const calculateFraminghamScore = (): number => {
    if (!data.age || !data.gender) return 0;

    let score = 0;

    if (data.gender === "male") {
      if (data.age >= 70) score += 11;
      else if (data.age >= 65) score += 10;
      else if (data.age >= 60) score += 8;
      else if (data.age >= 55) score += 6;
      else if (data.age >= 50) score += 4;
      else if (data.age >= 45) score += 2;
    } else {
      if (data.age >= 70) score += 12;
      else if (data.age >= 65) score += 9;
      else if (data.age >= 60) score += 7;
      else if (data.age >= 55) score += 4;
      else if (data.age >= 50) score += 2;
    }

    if (data.smokingStatus === "current") score += data.gender === "male" ? 4 : 3;
    if (data.diabetesHistory) score += data.gender === "male" ? 3 : 4;
    if (data.totalCholesterol && data.totalCholesterol > 240) score += 2;
    if (data.systolicBP && data.systolicBP > 140) score += 2;

    return Math.min(score, 20);
  };

  const calculateDiabetesRisk = (): number => {
    let score = 0;

    if (data.age >= 45) score += 1;
    if (data.familyDiabetes) score += 1;
    if (data.physicalActivity === "none") score += 1;

    if (data.weight && data.height) {
      const bmi = data.weight / Math.pow(data.height / 100, 2);
      if (bmi >= 30) score += 2;
      else if (bmi >= 25) score += 1;
    }

    return Math.min(score, 5);
  };

  const calculateMentalHealthScore = (): number => {
    const phq9Score = data.phq9Responses?.reduce((sum, val) => sum + val, 0) || 0;
    const gad7Score = data.gad7Responses?.reduce((sum, val) => sum + val, 0) || 0;

    return Math.min(Math.round((phq9Score + gad7Score) / 3), 20);
  };

  const calculateKidneyRisk = (): number => {
    let score = 0;

    if (data.age >= 60) score += 2;
    if (data.diabetesHistory) score += 3;
    if (data.systolicBP && data.systolicBP > 140) score += 2;

    if (data.creatinine) {
      const normalMax = data.gender === "male" ? 1.3 : 1.1;
      if (data.creatinine > normalMax) score += 3;
    }

    return Math.min(score, 10);
  };

  const riskScores: RiskScore[] = [
    {
      category: "Cardiovascular Health",
      score: calculateFraminghamScore(),
      risk: calculateFraminghamScore() <= 5 ? "low" : calculateFraminghamScore() <= 12 ? "moderate" : "high",
      icon: <Heart className="h-5 w-5" />,
      description: "Risk assessment for heart disease and stroke",
      recommendations: [
        "Regular cardio exercise 150min/week",
        "Mediterranean diet",
        "Blood pressure monitoring",
        "Lipid panel every 2 years"
      ]
    },
    {
      category: "Diabetes Risk",
      score: calculateDiabetesRisk(),
      risk: calculateDiabetesRisk() <= 1 ? "low" : calculateDiabetesRisk() <= 3 ? "moderate" : "high",
      icon: <Activity className="h-5 w-5" />,
      description: "Likelihood of developing type 2 diabetes",
      recommendations: [
        "Weight management",
        "Regular physical activity",
        "Balanced nutrition",
        "Annual glucose screening"
      ]
    },
    {
      category: "Mental Wellbeing",
      score: calculateMentalHealthScore(),
      risk: calculateMentalHealthScore() <= 5 ? "low" : calculateMentalHealthScore() <= 12 ? "moderate" : "high",
      icon: <Brain className="h-5 w-5" />,
      description: "Mental health and stress assessment",
      recommendations: [
        "Stress management techniques",
        "Regular sleep schedule",
        "Social connections",
        "Professional counseling if needed"
      ]
    },
    {
      category: "Kidney Function",
      score: calculateKidneyRisk(),
      risk: calculateKidneyRisk() <= 2 ? "low" : calculateKidneyRisk() <= 5 ? "moderate" : "high",
      icon: <Droplets className="h-5 w-5" />,
      description: "Kidney health and function indicators",
      recommendations: [
        "Stay hydrated",
        "Limit sodium intake",
        "Blood pressure control",
        "Annual kidney function tests"
      ]
    }
  ];

  const overallRisk = () => {
    const totalScore = riskScores.reduce((sum, item) => sum + item.score, 0);
    if (totalScore <= 10) return "low";
    if (totalScore <= 25) return "moderate";
    return "high";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800";
      case "moderate": return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
      case "high": return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";
      default: return "";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle className="h-3 w-3" />;
      case "moderate": return <Clock className="h-3 w-3" />;
      case "high": return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getProgressColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-500";
      case "moderate": return "bg-amber-500";
      case "high": return "bg-red-500";
      default: return "";
    }
  };

  const getRecommendation = () => {
    const risk = overallRisk();
    switch (risk) {
      case "low":
        return {
          title: "Excellent Health Foundation",
          description: "Your assessment shows low risk across most categories. You're on the right track with your health management.",
          action: "Continue with regular check-ups and consider our wellness optimization programs to maintain your health."
        };
      case "moderate":
        return {
          title: "Opportunities for Improvement",
          description: "Some areas show moderate risk levels. Early intervention now can significantly improve your long-term health outcomes.",
          action: "We recommend connecting with our healthcare specialists for a personalized prevention strategy."
        };
      case "high":
        return {
          title: "Immediate Medical Attention Recommended",
          description: "Your assessment indicates several risk factors that warrant prompt medical evaluation and intervention.",
          action: "Please consult with our medical team immediately for a comprehensive health evaluation and treatment plan."
        };
      default:
        return { title: "", description: "", action: "" };
    }
  };

  const recommendation = getRecommendation();

  const handleClick = () => {
    const end = Date.now() + 1 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
  };

  useEffect(() => {
    handleClick();
  }, []);


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 relative">
      {/* Header */}
      {/* <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight">Your Health Assessment</h1>
        <p className="text-muted-foreground text-md">Comprehensive analysis and personalized recommendations</p>
      </div> */}

      {/* Overall Summary */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-md font-semibold">{recommendation.title}</h2>
                {/* <Badge className={`${getRiskColor(overallRisk())} border px-1.5 py-1 !text-xs`}>
                  {getRiskIcon(overallRisk())}
                  <span className="ml-1 font-medium ">{overallRisk().toUpperCase()} RISK</span>
                </Badge> */}
              </div>
              <p className="text-muted-foreground text-sm">{recommendation.description}</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-primary/80">{recommendation.action}</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {riskScores.map((item, index) => (
          <Card key={index} className="group hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-md">{item.category}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
                {/* <Badge className={`${getRiskColor(item.risk)} border shrink-0`}>
                  {getRiskIcon(item.risk)}
                  <span className="ml-1 text-xs font-medium">{item.risk.toUpperCase()}</span>
                </Badge> */}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className="font-medium">{item.score}/20</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(item.risk)}`}
                    style={{ width: `${(item.score / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">RECOMMENDED ACTIONS</h4>
                <div className="space-y-1">
                  {item.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card>
        <CardContent className="p-8">
          {!showContactForm ? (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Get Your Detailed Report</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Download a comprehensive PDF report with detailed analysis, personalized action plans, and connect with our healthcare specialists for next steps.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <Button onClick={() => setShowContactForm(true)} size="lg" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Get Detailed Report
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Free comprehensive analysis • No spam • Secure & confidential
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Contact Information</h3>
                <p className="text-sm text-muted-foreground">Enter your details to receive your personalized report</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button className="w-full" size="lg" disabled={!name.trim() || !email.trim()}>
                  Send Report & Connect with Specialist
                </Button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  By submitting, you agree to receive communications from BioFit about your health assessment and our services. We respect your privacy and won't spam you.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};