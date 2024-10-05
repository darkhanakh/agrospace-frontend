"use client";

import { useEffect, useRef } from "react";
import { router } from "next/client";
import Link from "next/link";

const Home = () => {
  const headerImgRef = useRef<HTMLDivElement>(null);
  const marketAnalysisImgRef = useRef<HTMLDivElement>(null);
  const priceOptimizationImgRef = useRef<HTMLDivElement>(null);
  const seasonalAnalysisImgRef = useRef<HTMLDivElement>(null);
  const individualRecommendationsImgRef = useRef<HTMLDivElement>(null);
  const dataIntegrationImgRef = useRef<HTMLDivElement>(null);
  const supportAndTrainingImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerImgRef.current) {
      headerImgRef.current.style.backgroundImage = "url(./img/bg.png)";
    }
    if (marketAnalysisImgRef.current) {
      marketAnalysisImgRef.current.style.backgroundImage =
        "url(./img/landing1.webp)";
    }
    if (priceOptimizationImgRef.current) {
      priceOptimizationImgRef.current.style.backgroundImage =
        "url(./img/landing6.webp)";
    }
    if (seasonalAnalysisImgRef.current) {
      seasonalAnalysisImgRef.current.style.backgroundImage =
        "url(./img/landing4.webp)";
    }
    if (individualRecommendationsImgRef.current) {
      individualRecommendationsImgRef.current.style.backgroundImage =
        "url(./img/landing3.png)";
    }
    if (dataIntegrationImgRef.current) {
      dataIntegrationImgRef.current.style.backgroundImage =
        "url(./img/landing2.webp)";
    }
    if (supportAndTrainingImgRef.current) {
      supportAndTrainingImgRef.current.style.backgroundImage =
        "url(./img/landing5.webp)";
    }
  }, []);

  return (
    <div className="w-full">
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden w-[90%] mx-auto shadow-lg">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f2f4f0] px-4 py-3 sm:px-10 sm:mt-5">
            <div className="flex items-center gap-4">
              <h2 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em]">
                AgroSpace
              </h2>
            </div>
            <Link href={"/auth/login"}>
              <button className="text-white flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#5de619] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Начать</span>
              </button>
            </Link>
          </header>
          <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="@container">
                <div className="@[480px]:p-4">
                  <div
                    ref={headerImgRef}
                    className="flex min-h-[320px] sm:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  >
                    <div className="flex flex-col gap-2 text-left">
                      <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] text-white">
                        Умные решения для вашего агробизнеса с AgroSpace!
                      </h1>
                      <h2 className="text-white sm:text-md text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        AgroSpace помогает фермерам в Казахстане оптимизировать
                        цены на агропродукты, используя передовые технологии
                        искусственного интеллекта и анализа данных.
                      </h2>
                    </div>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#5de619] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Начать</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-10 px-4 sm:px-4 py-10 @container">
                <div className="flex flex-col gap-4">
                  <h1 className="text-[#131811] tracking-light text-[28px] sm:text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Особенности
                  </h1>
                  <p className="text-[#131811] text-base font-normal leading-normal max-w-[720px]">
                    AgroSpace — мощный инструмент для фермеров и агробизнеса.
                    Вот несколько особенностей, которые отличают нас:
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      ref={marketAnalysisImgRef}
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        Рыночный анализ
                      </p>
                      <p className="text-[#6f8863] text-sm font-normal leading-normal">
                        Наш сервис анализирует текущие рыночные цены на
                        агропродукты, предоставляя вам точную информацию о
                        спросе и предложении.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      ref={priceOptimizationImgRef}
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        Оптимизация цен
                      </p>
                      <p className="text-[#6f8863] text-sm font-normal leading-normal">
                        С помощью передовых алгоритмов искусственного интеллекта
                        мы предлагаем вам оптимальные цены для максимизации
                        вашей прибыли.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      ref={seasonalAnalysisImgRef}
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        Сезонный анализ
                      </p>
                      <p className="text-[#6f8863] text-sm font-normal leading-normal">
                        Наши инструменты позволяют учитывать сезонные изменения
                        цен и производства, помогая вам планировать свои
                        операции более эффективно.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-10 px-4 pt-5 pb-10 @container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      ref={individualRecommendationsImgRef}
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        Индивидуальные рекомендации
                      </p>
                      <p className="text-[#6f8863] text-sm font-normal leading-normal">
                        Мы учитываем специфику вашего хозяйства и предоставляем
                        индивидуальные рекомендации по ценообразованию и
                        управлению затратами.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      ref={dataIntegrationImgRef}
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        Интеграция данных
                      </p>
                      <p className="text-[#6f8863] text-sm font-normal leading-normal">
                        Наш сервис легко интегрируется с вашими существующими
                        системами, обеспечивая бесшовное управление данными и
                        удобный доступ к аналитическим инструментам.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      ref={supportAndTrainingImgRef}
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        Поддержка и обучение
                      </p>
                      <p className="text-[#6f8863] text-sm font-normal leading-normal">
                        Мы предлагаем круглосуточную поддержку и обучающие
                        материалы, чтобы вы могли максимально эффективно
                        использовать наш сервис и добиваться лучших результатов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="@container">
                <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-[#131811] text-center mx-auto tracking-light text-[28px] sm:text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                      Готовы превратить данные в прибыль с AgroSpace?
                    </h1>
                    <p className="text-[#131811] text-base font-normal leading-normal text-center pt-3 mx-auto max-w-[720px]">
                      Попробуйте AgroSpace, вы получите доступ к актуальной
                      рыночной информации и полезным аналитическим инструментам
                      для принятия обоснованных решений.
                    </p>
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="flex justify-center">
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#5de619] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow">
                        <span className="truncate">Начать</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
