#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix remaining encoding issues in byte-level
"""

# Read as binary
with open('SPRING_BOOT_CONVERSATIONS_fixed.md', 'rb') as f:
    data = f.read()

# Replace the malformed byte sequence
# ngưọ‍i = b'ng\xc6\xb0\xe1\xbb\x8d\xc2\x9di'
# người = b'ng\xc6\xb0\xe1\xbb\x9di'
replacements = [
    (b'ng\xc6\xb0\xe1\xbb\x8d\xc2\x9di', b'ng\xc6\xb0\xe1\xbb\x9di'),  # ngưọ‍i → người (still wrong)
    (b'ng\xc6\xb0\xe1\xbb\x8di', b'ng\xc6\xb0\xe1\xbb\x9di'),  # ngưọi → người
]

for old, new in replacements:
    count = data.count(old)
    if count > 0:
        print(f"Replacing {count} occurrences of {old!r} with {new!r}")
        data = data.replace(old, new)

# Write back
with open('SPRING_BOOT_CONVERSATIONS_final2.md', 'wb') as f:
    f.write(data)

print("✓ Fixed! Output: SPRING_BOOT_CONVERSATIONS_final2.md")
