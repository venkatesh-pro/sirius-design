import Navbar from '@/components/Navbar';
import React from 'react';

const Slider = () => {
  return <img src={'/banner1.jpg'} className="h-full w-full"></img>;
};

const formatPrice = (currency: string, value: number) => {
  return `${currency === 'dollar' && '$'}${new Intl.NumberFormat().format(value)}`;
};
const Configurator = () => {
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
  };
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
                className="py-[22px] px-[16px] flex  justify-between border-[#C4C4C4] border-[1px] rounded-[12px] mt-[16px]"
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
        <div className="mt-[16px] flex rounded-full ">
          {data.exteriorFinishes.map((exteriorFinish, exteriorFinishIndex) => {
            return (
              <div
                key={exteriorFinishIndex}
                className={`w-[35px] h-[35px]`}
                style={{
                  background: exteriorFinish.color,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const page = () => {
  return (
    <div className="flex justify-between">
      <div className="h-[100dvh] min-w-[1248px] wrapper">
        <Navbar />
        <div className="h-[calc(100%-56px)] w-full bg-blue-400 ">
          <Slider />
        </div>
      </div>
      <div className="mt-[140px]">
        <Configurator />
      </div>
    </div>
  );
};

export default page;
