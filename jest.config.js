module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.js(x)?'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  modulePaths: ['<rootDir>/src/', '<rootDir>/.jest']
}