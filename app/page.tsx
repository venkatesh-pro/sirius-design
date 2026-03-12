'use client';

import Navbar from '@/components/Navbar';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const Slider = () => {
  return <img src={'/banner1.jpg'} className="h-full w-full"></img>;
};

const formatPrice = (currency: string, value: number) => {
  return `${currency === 'dollar' && '$'}${new Intl.NumberFormat().format(value)}`;
};

const InputField = ({ type, placeholder, register, label, isRequired, errors }) => {
  return (
    <input
      className={`h-[56px] w-full py-[20px] px-[24px] rounded-[100px] border-[1px] border-[#C4C4C4] focus:outline-[1px] focus:outline-[#171A20] focus:border-[#171A20] placeholder:text-[#5C5E62] text-[17px] font-[400] placeholder:text-[17px] placeholder:font-[400] tracking-[1%] leading-[100%] ${
        errors?.[label] &&
        '!border-[#B74134] !placeholder-[#B74134] !bg-[#ED4E3B1A] active:!border-[#B74134] focus:!border-[#B74134] focus:!outline-none '
      }`}
      type={type}
      placeholder={placeholder}
      {...register(label, {
        required: isRequired ? 'Required' : false,
      })}
    />
  );
};
const Configurator = () => {
  const [isContinue, setIsContinue] = useState(true);

  const data = {
    sizes: [
      {
        name: '4.0m x 3.2m',
        value: 12.8,
        unit: 'sqm',
        pricing: {
          price: 32000,
          currency: 'dollar',
        },
        isActive: true,
      },
      {
        name: '6.0m x 3.2m',
        value: 19.2,
        unit: 'sqm',
        pricing: {
          price: 42000,
          currency: 'dollar',
        },
        isActive: false,
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
        name: 'Mercury',
        isActive: false,
      },
      {
        color: '#CDCCC2',
        name: 'Pastel Grey',
        isActive: false,
      },
      {
        color: '#505051',
        name: 'Vampire Grey',
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
          currency: 'dollar',
        },
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
          currency: 'dollar',
        },
      },
    ],

    optionalUpgrades: [
      {
        name: 'Double Glazed Glass',
        description: 'Improved thermal and acoustic performance',
        pricing: {
          price: 3950,
          currency: 'dollar',
        },
        isActive: true,
      },
      {
        name: 'Step Deck',
        description: 'Integrated entry platform for raised floor system',
        pricing: {
          price: 1400,
          currency: 'dollar',
        },
        isActive: true,
      },
      {
        name: 'Brand Facade Panel',
        description: 'Prepared panel area for tenant signage or branding',
        pricing: {
          price: 2200,
          currency: 'dollar',
        },
        isActive: true,
      },
    ],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => console.log(data);

  return (
    <div className="mx-[48px]">
      <div>
        <h1 className="text-[40px] font-[400] leading-[100%] tracking-[0%] text-[#171A20]">
          Sirius Shell
        </h1>
        <div className="mt-[20px]">
          <p className="text-[17px] font-[400] leading-[100%] tracking-[1%] text-[#171A20]">
            Modular Commercial Infrastructure
          </p>
          <p className="text-[14px] font-[400] leading-[100%] tracking-[1.5%] text-[#5C5E62] mt-[10px]">
            Designed and manufactured in Australia. Fully assembled modular building. Delivered
            complete and ready for fit-out.
          </p>
        </div>
      </div>

      {/* TODO: fix the box text max width */}
      {/* size */}
      <div className="mt-[60px]">
        <h1 className="text-[21px] font-[400] leading-[100%] tracking-[1%] ">
          <span className="text-[#171A20]">Size.</span>{' '}
          <span className="text-[#808080]">How much space do you need?</span>
        </h1>
        <p className="text-[14px] font-[400] leading-[100%] tracking-[1.5%] text-[#5C5E62] mt-[8px]">
          All models are delivered as open floor space ready for custom fit-out.
        </p>
        <div className="">
          {data.sizes.map((size, sizeIndex) => {
            return (
              <div
                key={sizeIndex}
                className="py-[22px] px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px] min-w-[342px]"
              >
                <div>
                  <p className="text-[#171A20] text-[17px] font-[400] tracking-[1%] leading-[100%]">
                    {size.name}
                  </p>
                  <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%] mt-[5px]">
                    {size.value} {size.unit}
                  </p>
                </div>
                <div>
                  <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%]">
                    From {formatPrice(size.pricing.currency, size.pricing.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* exterior finish */}
      <div className="mt-[60px]">
        <h1 className="text-[21px] font-[400] leading-[100%] tracking-[1%] ">
          <span className="text-[#171A20]">Exterior finish.</span>{' '}
          <span className="text-[#808080]">Pick your favourite.</span>
        </h1>
        <div className="mt-[16px]">
          <p className="text-[17px] font-[400] leading-[100%] tracking-[1%] text-[#171A20]">
            Black
          </p>
          <p className="text-[14px] font-[400] leading-[100%] tracking-[1.5%] text-[#5C5E62] mt-[5px]">
            Included
          </p>
        </div>
        <div className="mt-[16px] flex gap-[17px] ">
          {data.exteriorFinishes.map((exteriorFinish, exteriorFinishIndex) => {
            return (
              <div
                key={exteriorFinishIndex}
                className={`w-[35px] h-[35px] rounded-full `}
                style={{
                  background: exteriorFinish.color,
                }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* interior finish */}
      <div className="mt-[60px]">
        <h1 className="text-[21px] font-[400] leading-[100%] tracking-[1%] ">
          <span className="text-[#171A20]">Interior finish.</span>{' '}
          <span className="text-[#808080]">How ready should the interior be?</span>
        </h1>
        <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%] mt-[8px]">
          All models include open interior with lighting and power ready for use.
        </p>

        <div>
          {data.interiorFinishes.map((interiorFinish, interiorFinishIndex) => {
            return (
              <div
                key={interiorFinishIndex}
                className="py-[22px] px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px] min-w-[342px]"
              >
                <div>
                  <p className="text-[#171A20] text-[17px] font-[400] tracking-[1%] leading-[100%]">
                    {interiorFinish.name}
                  </p>
                  <p className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[100%] mt-[5px]">
                    {interiorFinish.description}
                  </p>

                  <div>
                    <p className="text-[#171A20] text-[15px] font-[400] tracking-[1.5%] leading-[100%] mt-[16px]">
                      Includes:
                    </p>
                    <ul className="">
                      {interiorFinish.includes.map(include => {
                        return (
                          <li className="text-[14px] text-[#5C5E62] font-[400] tracking-[1.5%] leading-[100%] mt-[6px]">
                            {include}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%]">
                    {formatPrice(interiorFinish.pricing.currency, interiorFinish.pricing.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* optional upgrades */}
      <div className="mt-[60px]">
        <h1 className="text-[21px] font-[400] leading-[100%] tracking-[1%] ">
          <span className="text-[#171A20]">Optional upgrades.</span>{' '}
          <span className="text-[#808080]">Select the options that work for you.</span>
        </h1>

        <div>
          {data.optionalUpgrades.map((optionalUpgrade, optionalUpgradeIndex) => {
            return (
              <div
                key={optionalUpgradeIndex}
                className="py-[22px] px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px] min-w-[342px]"
              >
                <div>
                  <p className="text-[#171A20] text-[17px] font-[400] tracking-[1%] leading-[100%]">
                    {optionalUpgrade.name}
                  </p>
                  <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%] mt-[5px]">
                    {optionalUpgrade.description}
                  </p>
                </div>
                <div>
                  <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%]">
                    {formatPrice(optionalUpgrade.pricing.currency, optionalUpgrade.pricing.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* optional upgrades */}
      <div className="mt-[60px]">
        <p className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[100%]">
          Estimated price:
        </p>
        {/* TODO: dynamic */}
        <p className="mt-[4px]">
          <span className="text-[#171A20] text-[21px] font-[400] tracking-[1.5%] leading-[100%]">
            A$64,200
          </span>
          <span className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[100%]">
            + GST
          </span>
        </p>

        <p className="text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[100%] mt-[20px]">
          Estimated lead time:
        </p>
        <p className="mt-[4px] text-[#171A20] text-[14px] font-[400] tracking-[1.5%] leading-[100%]">
          3-6 weeks depending on production schedule.
        </p>
        <p className="mt-[20px] text-[#5C5E62] text-[12px] font-[400] tracking-[1.5%] leading-[100%]">
          Final delivery cost and site preparation may vary depending on location and installation
          requirements.
        </p>

        <button
          onClick={() => {
            setIsContinue(true);
          }}
          className="cursor-pointer mt-[32px] w-full h-[56px] bg-[#171A20] rounded-[100px] text-white text-[17px] font-[400] tracking-[1%] leading-[100%]"
        >
          Continue
        </button>
      </div>

      <div className="h-[80px]"></div>
      {/* submit details */}
      {isContinue && (
        <div>
          <p className="text-[#171A20] text-[21px] font-[500] tracking-[1%] leading-[100%]">
            Submit details to confirm price and delivery availability.
          </p>
          <p className="text-[#5C5E62] text-[14px] font-[400] tracking-[1.5%] leading-[100%] mt-[8px]">
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
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
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
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
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
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
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
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
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
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
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
                type={'text'}
                errors={errors}
              />
              {errors.emailAddress && (
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
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
                <p className="text-[14px] mt-[10px] tracking-[1.5%] leading-[100%] font-[400] text-[#B74134]">
                  {errors.phoneNumber.message as string}
                </p>
              )}
            </div>
          </div>

          <p className="text-[14px] mt-[24px] tracking-[1.5%] leading-[100%] font-[400] text-[#171A20]">
            Estimated production lead time: 3-6 weeks from confirmed order.
          </p>
          <p className="text-[14px] mt-[16px] tracking-[1.5%] leading-[100%] font-[400] text-[#5C5E62]">
            Pricing shown is indicative based on selected configuration. Delivery, installation and
            permits may vary by site and location.
          </p>
          <button
            onClick={handleSubmit(onSubmit)}
            className="cursor-pointer mt-[32px] w-full h-[56px] bg-[#171A20] rounded-[100px] text-white text-[17px] font-[400] tracking-[1%] leading-[100%]"
          >
            Request Proposal
          </button>
        </div>
      )}
    </div>
  );
};
const page = () => {
  return (
    <div className="flex justify-between">
      <div className="h-[100dvh] sticky top-0 min-w-[1248px] wrapper">
        <Navbar />
        <div className="h-[calc(100%-56px)] w-full bg-blue-400 ">
          <Slider />
        </div>
      </div>
      <div className="mt-[140px]">
        <Configurator />
        <div className="h-[500px] "></div>
      </div>
    </div>
  );
};

export default page;
