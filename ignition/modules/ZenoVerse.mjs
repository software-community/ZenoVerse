import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZenoVerseModule = buildModule("ZenoVerseModule", (m) => {
  const zenoVerse = m.contract("ZenoVerse");

  return { zenoVerse };
});

export default ZenoVerseModule;
