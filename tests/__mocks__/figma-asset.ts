// =============================================================================
// Mock for figma:asset/* imports in test environment
// =============================================================================
// Figma Make uses figma:asset/xxx.png as virtual module imports.
// In local/test environment, we resolve all figma:asset imports to
// a placeholder string to prevent import errors.
// =============================================================================

export default '/mock-asset-placeholder.png';
