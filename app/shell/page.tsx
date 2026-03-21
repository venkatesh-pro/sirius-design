'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import Navbar from '@/components/Navbar';
import Slider from '@/components/Slider/Slider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FieldErrors, FieldValues, useForm, UseFormRegister } from 'react-hook-form';
import toast from 'react-hot-toast';

// const Slider = ({ sliderImages, setSliderImages }) => {
//   return <img src={'/banner1.jpg'} className="h-full w-full"></img>;
// };

gsap.registerPlugin(useGSAP, ScrollTrigger);

const formatPrice = (currency: string, value: number) => {
  return `${currency === 'dollar' && '$'}${new Intl.NumberFormat().format(value)}`;
};

const InputField = ({
  type,
  placeholder,
  register,
  label,
  isRequired,
  errors,
  pattern,
}: {
  type: 'text' | 'number' | 'email';
  placeholder: string;
  label: string;
  pattern?: string;
  errors?: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
  isRequired?: boolean;
}) => {
  return (
    <input
      className={`h-[56px] w-full py-[20px] px-[24px] rounded-[100px] border-[1px] border-[#C4C4C4] focus:outline-[1px] focus:outline-[#171A20] focus:border-[#171A20] placeholder:text-[#5C5E62] text-[17px] font-[400] placeholder:text-[17px] placeholder:font-[400] tracking-[1%] leading-[140%] ${
        errors?.[label] &&
        '!border-[#B74134] !placeholder-[#B74134] !bg-[#ED4E3B1A] active:!border-[#B74134] focus:!border-[#B74134] focus:!outline-none '
      }`}
      type={type}
      placeholder={placeholder}
      {...register(label, {
        required: isRequired ? 'Required' : false,
        pattern: pattern
          ? {
              value: new RegExp(pattern),
              message: 'Invalid format',
            }
          : undefined,
      })}
    />
  );
};

type Pricing = {
  price: number;
  addPrice: number;
  currency: string;
};

type Size = {
  name: string;
  value: string;
  unit: string;
  pricing: Pricing;
  isActive: boolean;
};

type ExteriorFinish = {
  color: string;
  name: string;
  isActive: boolean;
};

type InteriorFinish = {
  name: string;
  description: string;
  includes: string[];
  pricing: Pricing;
  isActive: boolean;
};

type OptionalUpgrade = {
  name: string;
  description: string;
  pricing: Pricing;
  isActive: boolean;
};

type ConfiguratorData = {
  sizes: Size[];
  exteriorFinishes: ExteriorFinish[];
  interiorFinishes: InteriorFinish[];
  optionalUpgrades: OptionalUpgrade[];
};

type ConfiguratorProps = {
  configuratorData: ConfiguratorData;
  setConfiguratorData: React.Dispatch<React.SetStateAction<ConfiguratorData>>;
  setSliderImages: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageConfiguration: () => void;
  isInInteriorSection: React.MutableRefObject<boolean>;
  imageMobileExterior: string;
  imageMobileInterior: string;
};

const Configurator = ({
  configuratorData,
  setConfiguratorData,
  setSliderImages,
  handleImageConfiguration,
  isInInteriorSection,
  imageMobileExterior,
  imageMobileInterior,
}: ConfiguratorProps) => {
  const [isContinue, setIsContinue] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const interiorSectionRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);

    const size = configuratorData.sizes.find(s => s.isActive);
    const exterior = configuratorData.exteriorFinishes.find(e => e.isActive);
    const interior = configuratorData.interiorFinishes.find(i => i.isActive);
    const optionalUpgrades = configuratorData.optionalUpgrades.filter(o => o.isActive);

    const activeConfigurator = {
      size: size?.name,
      exteriorFinish: exterior?.name,
      interiorFinish: interior?.name,
      optionalUpgrades: optionalUpgrades.map(o => o.name),
      totalPrice: calculateTotalPrice(configuratorData),
    };

    const finalData = { ...data, configurator: activeConfigurator };

    console.log(finalData);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    });
    if (!res.ok) {
      toast.error('Sorry, Something went wrong');
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();

    console.log({ result });

    setIsSubmitted(true);
  };

  const calculateTotalPrice = (data: ConfiguratorData) => {
    let total = 0;

    // active size
    const activeSize = data.sizes.find(s => s.isActive);
    if (activeSize) total += activeSize.pricing.addPrice;

    // active interior finish
    const activeInterior = data.interiorFinishes.find(i => i.isActive);
    if (activeInterior) total += activeInterior.pricing.addPrice;

    // due to optional upgrades is like checkbox, we are doing forEach
    data.optionalUpgrades.forEach(upgrade => {
      if (upgrade.isActive) {
        total += upgrade.pricing.addPrice;
      }
    });

    return total;
  };

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(configuratorData);
  }, [configuratorData]);

  useGSAP(
    () => {
      if (!interiorSectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1303px)', () => {
        const trigger = ScrollTrigger.create({
          trigger: interiorSectionRef.current,
          start: 'top 60%',
          end: '30% top',
          markers: false,

          onEnter: () => {
            isInInteriorSection.current = true;
            const interior = configuratorData.interiorFinishes.find(i => i.isActive);

            const image = `/configuratorImages/interior/${
              interior?.name === 'Standard Interior' ? 'I2.jpg' : 'I1.jpg'
            }`;

            setSliderImages([image]);
          },

          onEnterBack: () => {
            isInInteriorSection.current = true;
            const interior = configuratorData.interiorFinishes.find(i => i.isActive);

            const image = `/configuratorImages/interior/${
              interior?.name === 'Standard Interior' ? 'I2.jpg' : 'I1.jpg'
            }`;

            setSliderImages([image]);
          },

          onLeave: () => {
            isInInteriorSection.current = false;
            handleImageConfiguration();
          },

          onLeaveBack: () => {
            isInInteriorSection.current = false;
            handleImageConfiguration();
          },
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [configuratorData], revertOnUpdate: true }
  );

  return (
    <>
      {isSubmitted !== true && (
        <div className="mx-[24px] min-[1303px]:mx-[48px] mt-[80px] min-[1303px]:mt-[140px]">
          {/* <pre>{JSON.stringify(configuratorData, null, 4)}</pre> */}
          <div>
            <h1 className="text-[40px] font-[500] leading-[120%] tracking-[0%] text-[#171A20]">
              Sirius Shell
            </h1>
            <div className="mt-[20px]">
              <p className="text-[17px] font-[500] leading-[120%] tracking-[1%] text-[#171A20]">
                Modular Commercial Infrastructure
              </p>
              <p className="text-[14px] font-[400] leading-[140%] tracking-[1.5%] text-[#5C5E62] mt-[10px]">
                Designed and manufactured in Australia. Fully assembled modular building. Delivered
                complete and ready for fit-out.
              </p>
            </div>
          </div>

          {/* TODO: fix the box text max width */}
          {/* size */}
          <div className="mt-[80px]">
            <h1 className="text-[21px] font-[500] leading-[120%] tracking-[1%] ">
              <span className="text-[#171A20]">Size.</span>{' '}
              <span className="text-[#808080]">How much space do you need?</span>
            </h1>
            <p className="text-[14px] font-[400] leading-[140%] tracking-[1.5%] text-[#5C5E62] mt-[8px]">
              All models are delivered as open floor space ready for custom fit-out.
            </p>
            <div className="">
              {configuratorData.sizes.map((size, sizeIndex) => {
                return (
                  <div
                    key={sizeIndex}
                    className={`cursor-pointer py-[22px]  px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px] desktop:min-w-[342px] ${
                      size.isActive && '!border-1 !border-[#171A20] outline-1 outline-[#171A20]'
                    }`}
                    onClick={() => {
                      const updatedData = {
                        ...configuratorData,
                        sizes: configuratorData.sizes.map(s =>
                          s.name === size.name
                            ? { ...s, isActive: true }
                            : { ...s, isActive: false }
                        ),
                      };
                      setConfiguratorData(updatedData);
                    }}
                  >
                    <div>
                      <p className="text-[#171A20] text-[17px] font-[500] tracking-[1%] leading-[140%]">
                        {size.name}
                      </p>
                      <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[5px]">
                        {size.value} {size.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
                        From {formatPrice(size.pricing.currency, size.pricing.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* exterior finish */}
          <div className="mt-[80px]">
            {/* this image is for responsive view */}
            <div className="min-[1303px]:hidden max-[1303px]:mb-[28px]">
              {imageMobileExterior && (
                <img src={imageMobileExterior} alt="exterior image" className="rounded-[12px]" />
              )}
            </div>
            <h1 className="text-[21px] font-[500] leading-[120%] tracking-[1%] ">
              <span className="text-[#171A20]">Exterior finish.</span>{' '}
              <span className="text-[#808080]">Pick your favourite.</span>
            </h1>
            <div className="mt-[16px]">
              <p className="text-[17px] font-[500] leading-[140%] tracking-[1%] text-[#171A20]">
                {
                  configuratorData.exteriorFinishes.find(exteriorFinish => exteriorFinish.isActive)
                    ?.name
                }
              </p>
              <p className="text-[14px] font-[400] leading-[140%] tracking-[1.5%] text-[#5C5E62] mt-[5px]">
                Included
              </p>
            </div>
            <div className="mt-[16px] flex gap-[5px] ">
              {configuratorData.exteriorFinishes.map((exteriorFinish, exteriorFinishIndex) => {
                return (
                  <div
                    key={exteriorFinishIndex}
                    className={` flex items-center w-[47px] h-[47px] justify-center p-[5px] border-2 border-transparent cursor-pointer ${
                      exteriorFinish.isActive ? 'border-2 rounded-full border-[#171A20]' : ''
                    }`}
                    style={{
                      border: `${
                        exteriorFinish.isActive ? '2px solid #171A20' : '2px solid transparent'
                      }`,
                    }}
                    onClick={() => {
                      const updatedData = {
                        ...configuratorData,
                        exteriorFinishes: configuratorData.exteriorFinishes.map(s =>
                          s.name === exteriorFinish.name
                            ? { ...s, isActive: true }
                            : { ...s, isActive: false }
                        ),
                      };
                      setConfiguratorData(updatedData);
                    }}
                  >
                    <div
                      key={exteriorFinishIndex}
                      className={`w-[35px] h-[35px] flex-none rounded-full `}
                      style={{
                        background: exteriorFinish.color,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* interior finish */}
          <div className="mt-[80px]" ref={interiorSectionRef}>
            {/* this image is for responsive view */}
            <div className="min-[1303px]:hidden max-[1303px]:mb-[28px]">
              {imageMobileInterior && (
                <img src={imageMobileInterior} alt="interior image" className="rounded-[12px]" />
              )}
            </div>
            <h1 className="text-[21px] font-[500] leading-[120%] tracking-[1%] ">
              <span className="text-[#171A20]">Interior finish.</span>{' '}
              <span className="text-[#808080]">How ready should the interior be?</span>
            </h1>
            <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[8px]">
              All models include open interior with lighting and power ready for use.
            </p>

            <div>
              {configuratorData.interiorFinishes.map((interiorFinish, interiorFinishIndex) => {
                return (
                  <div
                    key={interiorFinishIndex}
                    className={`cursor-pointer py-[22px] px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px] desktop:min-w-[342px]  ${
                      interiorFinish.isActive &&
                      '!border-1 !border-[#171A20] outline-1 outline-[#171A20]'
                    }`}
                    onClick={() => {
                      const updatedData = {
                        ...configuratorData,
                        interiorFinishes: configuratorData.interiorFinishes.map(s =>
                          s.name === interiorFinish.name
                            ? { ...s, isActive: true }
                            : { ...s, isActive: false }
                        ),
                      };
                      setConfiguratorData(updatedData);
                    }}
                  >
                    <div>
                      <p className="text-[#171A20] text-[17px] font-[500] tracking-[1%] leading-[120%]">
                        {interiorFinish.name}
                      </p>
                      <p className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[5px]">
                        {interiorFinish.description}
                      </p>

                      <div>
                        <p className="text-[#171A20] text-[15px] font-[400] tracking-[1.5%] leading-[120%] mt-[16px]">
                          Includes:
                        </p>
                        <ul className="">
                          {interiorFinish.includes.map((include, includeIndex) => {
                            return (
                              <li
                                key={includeIndex}
                                className="text-[14px] text-[#5C5E62] font-[400] tracking-[1.5%] leading-[140%] mt-[6px]"
                              >
                                {include}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
                        {formatPrice(interiorFinish.pricing.currency, interiorFinish.pricing.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* optional upgrades */}
          <div className="mt-[80px]">
            {/* this image is for responsive view */}
            <div className="min-[1303px]:hidden max-[1303px]:mb-[28px]">
              {imageMobileExterior && (
                <img src={imageMobileExterior} alt="exterior image" className="rounded-[12px]" />
              )}
            </div>
            <h1 className="text-[21px] font-[500] leading-[120%] tracking-[1%] ">
              <span className="text-[#171A20]">Optional upgrades.</span>{' '}
              <span className="text-[#808080]">Select the options that work for you.</span>
            </h1>

            <div>
              {configuratorData.optionalUpgrades.map((optionalUpgrade, optionalUpgradeIndex) => {
                return (
                  <div
                    onClick={() => {
                      const updatedData = {
                        ...configuratorData,
                        optionalUpgrades: configuratorData.optionalUpgrades.map(optional => {
                          return optional.name === optionalUpgrade.name
                            ? { ...optional, isActive: !optional.isActive }
                            : optional;
                        }),
                      };
                      setConfiguratorData(updatedData);
                    }}
                    key={optionalUpgradeIndex}
                    className={`cursor-pointer py-[22px] px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px] desktop:min-w-[342px] ${
                      optionalUpgrade.isActive &&
                      '!border-1 !border-[#171A20] outline-1 outline-[#171A20]'
                    }`}
                  >
                    <div>
                      <p className="text-[#171A20] text-[17px] font-[500] tracking-[1%] leading-[140%]">
                        {optionalUpgrade.name}
                      </p>
                      <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[5px]">
                        {optionalUpgrade.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
                        {formatPrice(
                          optionalUpgrade.pricing.currency,
                          optionalUpgrade.pricing.price
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated Price */}
          <div className="mt-[80px]">
            <p className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
              Estimated price:
            </p>
            <p className="mt-[4px]">
              <span className="text-[#171A20] text-[21px] font-[500] tracking-[1.5%] leading-[140%]">
                A{formatPrice('dollar', totalPrice)}
              </span>{' '}
              <span className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
                + GST
              </span>
            </p>

            <p className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[20px]">
              Estimated lead time:
            </p>
            <p className="mt-[4px] text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
              3-6 weeks depending on production schedule.
            </p>
            <p className="mt-[20px] text-[#5C5E62] text-[12px] font-[400] tracking-[1.5%] leading-[140%]">
              Final delivery cost and site preparation may vary depending on location and
              installation requirements.
            </p>
            {isContinue === false && (
              <button
                onClick={() => {
                  setIsContinue(true);
                }}
                className="cursor-pointer mt-[32px] w-full h-[56px] bg-[#171A20] rounded-[100px] text-white text-[17px] font-[400] tracking-[1%] leading-[140%]"
              >
                Continue
              </button>
            )}
          </div>

          <div className="h-[80px]"></div>
          {/* submit details */}
          {/* {isContinue && ( */}
          <div
            className={`overflow-hidden transition-all duration-1000 ${
              isContinue ? ' pacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-[#171A20] text-[21px] font-[500] tracking-[1%] leading-[120%]">
              Submit details to confirm price and delivery availability.
            </p>
            <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[8px]">
              Receive a formal proposal and delivery timeline for your project.
            </p>

            <div className="mt-[24px] flex flex-col gap-[16px]">
              <div>
                <InputField
                  isRequired={true}
                  label={'company'}
                  placeholder={'Company'}
                  register={register}
                  type={'text'}
                  errors={errors}
                />
                {errors.company && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.company.message as string}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  isRequired={true}
                  label={'name'}
                  placeholder={'Name'}
                  register={register}
                  type={'text'}
                  errors={errors}
                />
                {errors.name && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  isRequired={true}
                  label={'siteAddress'}
                  placeholder={'Site Address'}
                  register={register}
                  type={'text'}
                  errors={errors}
                />
                {errors.siteAddress && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.siteAddress.message as string}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  isRequired={true}
                  label={'postalCode'}
                  placeholder={'Postal Code'}
                  register={register}
                  type={'number'}
                  errors={errors}
                />
                {errors.postalCode && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.postalCode.message as string}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  isRequired={true}
                  label={'projectType'}
                  placeholder={'Project Type'}
                  register={register}
                  type={'text'}
                  errors={errors}
                />
                {errors.projectType && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.projectType.message as string}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  isRequired={true}
                  label={'emailAddress'}
                  placeholder={'Email Address'}
                  register={register}
                  type={'email'}
                  errors={errors}
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                />
                {errors.emailAddress && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.emailAddress.message as string}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  isRequired={true}
                  label={'phoneNumber'}
                  placeholder={'Phone Number'}
                  register={register}
                  type={'text'}
                  errors={errors}
                />
                {errors.phoneNumber && (
                  <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[140%] font-[400] text-[#B74134]">
                    {errors.phoneNumber.message as string}
                  </p>
                )}
              </div>
            </div>

            <p className="text-[14px] mt-[24px] tracking-[1.5%] leading-[120%] font-[400] text-[#171A20]">
              Estimated production lead time: 3-6 weeks from confirmed order.
            </p>
            <p className="text-[14px] mt-[16px] tracking-[1.5%] leading-[140%] font-[400] text-[#5C5E62]">
              Pricing shown is indicative based on selected configuration. Delivery, installation
              and permits may vary by site and location.
            </p>
            <button
              onClick={handleSubmit(onSubmit)}
              className="cursor-pointer mt-[32px] w-full h-[56px] bg-[#171A20] rounded-[100px] text-white text-[17px] font-[400] tracking-[1%] leading-[140%]"
            >
              Request Proposal
            </button>
          </div>
          {/* )} */}

          {isContinue === true && <div className="h-[80px]"></div>}
        </div>
      )}
      {/* {isSubmitted && ( */}
      <div
        className={`overflow-hidden transition-all duration-[1.2s] mx-[24px] min-[1303px]:mx-[48px] flex items-center justify-center flex-col h-[calc(100dvh-80px)] min-[1303px]:h-[100%] ${
          isSubmitted ? ' opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className=" text-[#171A20] text-[17px] font-[500] tracking-[1%] leading-[140%] text-center">
          Your proposal request has been submitted.
        </p>
        <button
          className="cursor-pointer mt-[32px] w-full h-[56px] border-[#171A20] border-[1px] rounded-[100px] text-[#171A20] text-[17px] font-[400] tracking-[1%] leading-[140%]"
          onClick={() => (window.location.href = '')}
        >
          Explore Sirius Shell
        </button>
      </div>
      {/* )} */}

      {/* stick pricing div */}
      {isSubmitted !== true && (
        <div className="bg-[#D4D4D44D] py-[16px] px-[24px] rounded-[12px] mx-[24px] sticky bottom-[56px] backdrop-blur-[80px]">
          <p className="text-[15px] tracking-[1.5%] leading-[140%] font-[400] text-[#171A20]">
            Estimated Price
          </p>
          <p className="mt-[4px]">
            <span className="text-[#171A20] text-[21px] font-[500] tracking-[1.5%] leading-[140%]">
              A{formatPrice('dollar', totalPrice)}
            </span>{' '}
            <span className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[140%]">
              + GST
            </span>
          </p>

          <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[140%] mt-[4px]">
            Estimated lead time: 3-6 weeks
          </p>
        </div>
      )}
    </>
  );
};

const page = () => {
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [imageMobileExterior, setImageMobileExterior] = useState('');
  const [imageMobileInterior, setImageMobileInterior] = useState('');

  const [configuratorData, setConfiguratorData] = useState<ConfiguratorData>({
    sizes: [
      {
        name: '6.0m x 3.2m',
        value: '19.20',
        unit: 'sqm',
        pricing: {
          price: 42000,
          addPrice: 42000,
          currency: 'dollar',
        },
        isActive: true,
      },
    ],
    exteriorFinishes: [
      {
        color: '#000000',
        name: 'Black',
        isActive: true,
      },
      {
        color: '#E6E6E6',
        name: 'White',
        isActive: false,
      },
      {
        color: '#CDCCC2',
        name: 'Sand',
        isActive: false,
      },
      {
        color: '#505051',
        name: 'Charcoal',
        isActive: false,
      },
    ],

    interiorFinishes: [
      {
        name: 'Base Structure',
        description: 'Ideal for tenant or developer fit-out',
        includes: [
          'Insulated walls and ceiling',
          'Internal wall and ceiling panels',
          'Electrical rough-in',
          'Finished exterior',
          'Structural flooring ready for client flooring install',
        ],
        pricing: {
          price: 42000,
          addPrice: 0,
          currency: 'dollar',
        },
        isActive: false,
      },
      {
        name: 'Standard Interior',
        description: 'Ready-to-use commercial space',
        includes: [
          'Finished commercial flooring',
          'Internal wall and ceiling panels',
          'Electrical installation (lighting + power outlets)',
          'Emergency lighting and exit signage',
          'Insulated walls and ceiling',
        ],
        pricing: {
          price: 48000,
          addPrice: 6000,
          currency: 'dollar',
        },
        isActive: true,
      },
    ],

    optionalUpgrades: [
      {
        name: 'Double Glazed Glass',
        description: 'Improved thermal and acoustic performance',
        pricing: {
          price: 3950,
          addPrice: 3950,
          currency: 'dollar',
        },
        isActive: false,
      },
      {
        name: 'Step Deck',
        description: 'Integrated entry platform for raised floor system',
        pricing: {
          price: 1400,
          addPrice: 1400,
          currency: 'dollar',
        },
        isActive: false,
      },
      {
        name: 'Brand Facade Panel',
        description: 'Prepared panel area for tenant signage or branding',
        pricing: {
          price: 2200,
          addPrice: 2200,
          currency: 'dollar',
        },
        isActive: false,
      },
    ],
  });

  const [selectedInterior, setSelectedInterior] = useState('');

  const isInInteriorSection = useRef(false);

  const handleImageConfiguration = () => {
    const activeColor = configuratorData.exteriorFinishes.find(c => c.isActive);
    const deck = configuratorData.optionalUpgrades.find(u => u.name === 'Step Deck')?.isActive;
    const brand = configuratorData.optionalUpgrades.find(
      u => u.name === 'Brand Facade Panel'
    )?.isActive;

    const interior = configuratorData.interiorFinishes.find(i => i.isActive);
    setSelectedInterior(interior?.name ?? '');

    const colorName = activeColor?.name.toLocaleLowerCase();

    console.log(isInInteriorSection.current);

    if (isInInteriorSection.current === false) {
      const image = `/configuratorImages/${colorName}/${
        interior?.name === 'Standard Interior' ? 'standard-' : ''
      }${colorName}-${deck ? 'deck' : 'no-deck'}-${brand ? 'brand' : 'no-brand'}.jpg`;

      console.log({ image });

      setSliderImages([image]);
    }
  };

  const handleImageConfigurationMobileExterior = () => {
    const activeColor = configuratorData.exteriorFinishes.find(c => c.isActive);
    const deck = configuratorData.optionalUpgrades.find(u => u.name === 'Step Deck')?.isActive;
    const brand = configuratorData.optionalUpgrades.find(
      u => u.name === 'Brand Facade Panel'
    )?.isActive;

    const interior = configuratorData.interiorFinishes.find(i => i.isActive);

    const colorName = activeColor?.name.toLocaleLowerCase();

    console.log(isInInteriorSection.current);

    const image = `/configuratorImages/${colorName}/${
      interior?.name === 'Standard Interior' ? 'standard-' : ''
    }${colorName}-${deck ? 'deck' : 'no-deck'}-${brand ? 'brand' : 'no-brand'}.jpg`;

    console.log({ image });

    setImageMobileExterior(image);
  };

  const handleImageConfigurationMobileInterior = () => {
    const interior = configuratorData.interiorFinishes.find(i => i.isActive);

    const image = `/configuratorImages/interior/${
      interior?.name === 'Standard Interior' ? 'I2.jpg' : 'I1.jpg'
    }`;

    setImageMobileInterior(image);
  };

  useEffect(() => {
    handleImageConfiguration();

    // TODO: only at the certain break point to solve the resource memory:
    handleImageConfigurationMobileExterior();
    handleImageConfigurationMobileInterior();
  }, [configuratorData, isInInteriorSection.current]);

  // after adding this css class, i faced this scroll issue from slider, so i added this `min-[1303px]:w-[30vw] min-[1303px]:h-[calc(100dvh-56px)] h-[calc(100dvh-(14px+21px+21px))] overflow-scroll`
  const configuratorRef = useRef<HTMLDivElement>(null);

  const handleLeftScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (configuratorRef.current) {
      configuratorRef.current.scrollTop += e.deltaY;
    }
  };

  // useEffect(() => {
  //   const preventPageScroll = (e: WheelEvent) => {
  //     // Allow normal scrolling if cursor is over the configurator
  //     if (configuratorRef.current && configuratorRef.current.contains(e.target as Node)) {
  //       return;
  //     }
  //     e.preventDefault();
  //   };

  //   document.addEventListener('wheel', preventPageScroll, { passive: false });
  //   return () => document.removeEventListener('wheel', preventPageScroll);
  // }, []);
  return (
    <>
      <div className="min-[1303px]:flex justify-between">
        <div
          className="max-[1303px]:hidden h-[100dvh] sticky top-0 w-[70vw]  desktop:min-w-[1248px] wrapper"
          // onWheel={handleLeftScroll}
        >
          <Navbar />
          <div className="h-[calc(100%-(56px+56px))] w-full">
            <Slider sliderImages={sliderImages} />
          </div>
        </div>
        {/* for mobile */}
        <div className="max-[1303px]:block hidden wrapper">
          <Navbar />
        </div>

        <div className="min-[1303px]:w-[30vw]">
          <Configurator
            configuratorData={configuratorData}
            setConfiguratorData={setConfiguratorData}
            setSliderImages={setSliderImages}
            handleImageConfiguration={handleImageConfiguration}
            isInInteriorSection={isInInteriorSection}
            // responsive
            imageMobileExterior={imageMobileExterior}
            imageMobileInterior={imageMobileInterior}
          />
        </div>
      </div>
      <div className="h-[56px]  sticky bottom-0 right-0 w-full -mt-[56px] bg-white"></div>
    </>
  );
};

export default page;
