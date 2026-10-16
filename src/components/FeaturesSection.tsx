import React from 'react';
import { Flame, Sparkles, Wheat, HeartHandshake, ShieldCheck, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Flame className="w-7 h-7 text-[#C83B32]" />,
      title: 'فرن حجري إيطالي على حرارة 450°C',
      description: 'نخبز البيتزا النابولية الكلاسيكية خلال 90 ثانية فقط في فرن مخصص، مما يمنحها الأطراف المنفوخة المرقطة (Cornicione) والقوام الطري والخفيف.',
    },
    {
      icon: <Wheat className="w-7 h-7 text-[#D9A441]" />,
      title: 'دقيق كابوتو وتخمير طبيعي 48 ساعة',
      description: 'نستخدم دقيق القمح الإيطالي الفاخر بنسبة استخراج دقيقة، مع تخمير بارد لمدة 48 ساعة لضمان خفة العجينة وسهولة هضمها الفائقة.',
    },
    {
      icon: <Award className="w-7 h-7 text-[#173D2B]" />,
      title: 'مكونات إيطالية أصيلة 100%',
      description: 'طماطم سان مارزانو الغنية المزروعة بجوار بركان فيزوف، وجبنة موتزاريلا دي بوفالا طازجة، مع زيت زيتون بكر ممتاز وأوراق الريحان الطازجة.',
    },
    {
      icon: <HeartHandshake className="w-7 h-7 text-[#C83B32]" />,
      title: 'باستا يدوية طازجة يومياً',
      description: 'عجين الباستا الإيطالية يُعجن ويُقطع يدوياً في مطبخنا كل صباح باستخدام صفار البيض البلدي الطازج والسميد الإيطالي القاسي.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-[#173D2B] text-white relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FFF8EF_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#D9A441] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
            الجودة دون مساومة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFF8EF]">
            سر التميز الإيطالي في رامبل زون 15 مايو
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#FFF8EF]/80 leading-relaxed">
            لا نكتفي بتقديم الطعام، بل ننقل روح المطبخ الإيطالي العريق بحرفية فائقة، من حقول كامبانيا إلى قلب مدينة 15 مايو.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 hover:border-[#D9A441]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 text-right flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#FFF8EF] mb-2 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FFF8EF]/75 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#D9A441] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>معايير الضيافة الإيطالية</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
