$pdf_mode = 1;
$out_dir = '.aux-files';
$aux_dir = '.aux-files';
$bibtex_use = 2;
$force_mode = 1;

# Ensure biber is found even when PATH is incomplete (e.g. in VS Code)
$ENV{'PATH'} = $ENV{'PATH'} . ':/usr/bin/vendor_perl' if -d '/usr/bin/vendor_perl';
