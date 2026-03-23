import re, os, sys

path = 'android/app/build.gradle'

with open(path, 'r') as f:
    content = f.read()

print("=== ORIGINAL app/build.gradle ===")
for i, line in enumerate(content.split('\n'), 1):
    print(f"{i:3}: {line}")

# Fix pattern: replace node --print execute() calls with hardcoded relative path
# Pattern 1: new File(["node", "--print", "require.resolve(...)"].execute().text.trim())
fixed = re.sub(
    r'new File\(\s*\[.*?"node".*?\.execute\(\)\.text\.trim\(\)\s*\)',
    'new File(rootProject.projectDir, "../node_modules/react-native")',
    content,
    flags=re.DOTALL
)

# Pattern 2: ["node", "--print", ...].execute().text.trim() standalone
fixed = re.sub(
    r'\["node",\s*"--print",\s*"require\.resolve\(\'react-native/package\.json\'\)"[^\]]*\]\.execute\(\)\.text\.trim\(\)',
    '"' + os.path.abspath('node_modules/react-native') + '"',
    fixed
)

if fixed != content:
    print("\n=== PATCHED - changes made ===")
    with open(path, 'w') as f:
        f.write(fixed)
else:
    print("\n=== NO CHANGES MADE - pattern not found ===")
    print("Trying alternative: writing known-good app/build.gradle")

print("\n=== FINAL app/build.gradle ===")
with open(path, 'r') as f:
    final = f.read()
for i, line in enumerate(final.split('\n'), 1):
    print(f"{i:3}: {line}")
