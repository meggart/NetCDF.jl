var documenterSearchIndex = {"docs":
[{"location":"strings/#Short-note-on-reading-and-writing-NC_CHAR-and-NC_STRING-variables","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"","category":"section"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"There are two common types for storing String data in NetCDF variables. The first is NC_CHAR, where a 1D array of strings is stored in a 2D char** array. Here the user must define the maximum string length and add a respective NetCDF dimension. Since NetCDF4 there is the NC_STRING data type that allows  the direct definition of String variables so that an N-dimensional String array directly maps to an N-dimensional  array in the NetCDF file structure.","category":"page"},{"location":"strings/#NC_STRING-variables","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"NC_STRING variables","text":"","category":"section"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"In this package, the Julia type String maps to the NC_STRING datatype, which means that creating a variable with any of","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"nccreate(filename, varname, dims..., t=String)","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"or","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"NcVar(varname,dims,t=String)","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"will result in a NetCDF variable of type NC_STRING. You can directly write an Array{String} of matching shape to these variables. Similarly, calling ncread or NetCDF.readvar on any of these variables will return an Array{String}","category":"page"},{"location":"strings/#NC_CHAR-variables","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"NC_CHAR variables","text":"","category":"section"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"Dealing with NC_CHAR variables is a bit more complicated. This has 2 reasons. First, the dimensions of the NetCDF variables do not match the dimensions of the resulting string array because of the additional str_len (or similar) axis that is introduced in the NetCDF file. So an n-dimensional String-Array maps to an (n+1)-dimensional NC_CHAR array.","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"Second, historically the NC_CHAR type has been used to store compressed data, too. So it is not always desirable to automatically convert these char arrays to strings. Anyhow, here is how you can deal with these variable types:","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"Assume you have a NetCDF variable of type NC_CHAR of dimensions (str_len: 10, axis2: 20). Calling x=ncread(...) or x=readvar(...) on this variable will return an Array{ASCIIChar,2} with size (10,20) as it is represented on disk. The ASCIIChar type is a small wrapper around UInt8, needed for dispatch. You can simply convert them to either Char or UInt8 using the convert function. The returned array can either be used directly (if it is numeric maybe use reinterpret(UInt8,x)) or convert them to a Vector{String} by calling","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"y=nc_char2string(x)","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"which will return a string vector of length 20.","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"An example for creating NC_CHAR and writing variables would be the following:","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"nccreate(filename,varname,\"str_len\",20,\"DimValues\",5,t=NC_CHAR)\nxs = [\"a\",\"bb\",\"ccc\",\"dddd\",\"eeeee\"]\nncwrite(filename,varname,nc_string2char(xs))","category":"page"},{"location":"strings/","page":"Short note on reading and writing NC_CHAR and NC_STRING variables","title":"Short note on reading and writing NC_CHAR and NC_STRING variables","text":"The call of string2char will convert the Vector{String} to a Matrix{UInt8}. which can be written to the NetCDF file.","category":"page"},{"location":"intermediate/#Medium-level-interface","page":"Medium-level interface","title":"Medium-level interface","text":"","category":"section"},{"location":"intermediate/#Open-a-file","page":"Medium-level interface","title":"Open a file","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NetCDF.open","category":"page"},{"location":"intermediate/#NetCDF.open","page":"Medium-level interface","title":"NetCDF.open","text":"NetCDF.open(fil::AbstractString,v::AbstractString)\n\nopens a NetCDF variable v in the NetCDF file fil and returns an NcVar handle that implements the AbstractArray interface for reading and writing. Note that it is in the user's responsibility to close the file after usage using NetCDF.close.\n\nKeyword arguments\n\nmode mode in which the file is opened, defaults to NC_NOWRITE, choose NC_WRITE for write access\nreaddimvar determines if dimension variables will be read into the file structure, default is false\n\n\n\n\n\nNetCDF.open(fil::AbstractString)\n\nopens the NetCDF file fil and returns a NcFile handle. Note that it is in the user's responsibility to close the file after usage using NetCDF.close.\n\nKeyword arguments\n\nmode mode in which the file is opened, defaults to NC_NOWRITE, choose NC_WRITE for write access\nreaddimvar determines if dimension variables will be read into the file structure, default is false\n\n\n\n\n\nNetCDF.open(f::Function, args...;kwargs...)\n\nOpens a NetCDF file, applies the function f on the resulting file or variable handle and properly closes the file after usage. This is convenient to use together with the do block syntax, for example:\n\ndata = open(\"myfile.nc\",\"myvar\") do v   NetCDF.readvar(v,start=[1,1,1], count=[-1,-1,1]) end\n\n\n\n\n\n","category":"function"},{"location":"intermediate/#Getting-information","page":"Medium-level interface","title":"Getting information","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"The NetCDF.open function returns an object of type NcFile which contains meta-Information about the file and associated variables. You can index the NcFile object nc[varname] to retrieve an NcVar object and retrieve information about it. You can run names(nc) to get a list of available variables.","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"Most of the following functions of the medium-level interface will use either an NcFile or an NcVar object as their first argument.","category":"page"},{"location":"intermediate/#Reading-data","page":"Medium-level interface","title":"Reading data","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NetCDF.readvar","category":"page"},{"location":"intermediate/#NetCDF.readvar","page":"Medium-level interface","title":"NetCDF.readvar","text":"NetCDF.readvar(v::NcVar;start::Vector=ones(UInt,ndims(d)),count::Vector=size(d))\n\nReads the values from the file associated to the NcVar object v and returns them. By default the whole variable is read\n\nKeyword arguments\n\nstart Vector of length ndim(v) setting the starting index for each dimension\ncount Vector of length ndim(v) setting the count of values to be read along each dimension. The value -1 is treated as a special case to read all values from this dimension\n\nExample\n\nAssume v is a NetCDF variable with dimensions (3,3,10).\n\nx = NetCDF.readvar(v, start=[1,2,1], count=[3,1,-1])\n\nThis reads all values from the first and last dimension and only the second value from the second dimension.\n\n\n\n\n\nNetCDF.readvar{T,N}(v::NcVar{T,N},I::Union{Integer, UnitRange, Colon}...)\n\nReads data from a NetCDF file with array-style indexing. Integers and UnitRanges and Colons are valid indices for each dimension.\n\n\n\n\n\n","category":"function"},{"location":"intermediate/#Writing-data","page":"Medium-level interface","title":"Writing data","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NetCDF.putvar","category":"page"},{"location":"intermediate/#NetCDF.putvar","page":"Medium-level interface","title":"NetCDF.putvar","text":"NetCDF.putvar(v::NcVar,vals::Array;start::Vector=ones(Int,length(size(vals))),count::Vector=[size(vals)...])\n\nWrites the values from the array vals to a NetCDF file. v is the NcVar handle of the respective variable and vals an array with the same dimension as the variable in the NetCDF file.\n\nKeyword arguments\n\nstart Vector of length ndim(v) setting the starting index for each dimension\ncount Vector of length ndim(v) setting the count of values to be read along each dimension. The value -1 is treated as a special case to read all values from this dimension\n\n\n\n\n\nNetCDF.putvar(v::NcVar, val, i...)\n\nWrites the value(s) val to the variable v while the indices are given in in an array-style indexing manner.\n\n\n\n\n\n","category":"function"},{"location":"intermediate/#Creating-files","page":"Medium-level interface","title":"Creating files","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"To create a NetCDF file you first have to define the dimensions and variables that it is supposed to hold. As representations for NetCDF dimensions and variables there are the predefined NcVar and NcDim types. An NcDim object is created by:","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NcDim(dimname, dimlength, atts=Dict{Any,Any}(), values=[], unlimited=false)","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"here dimname is the dimension name, dimlength is the dimension length. The optional argument values is a 1D array of values that are written to the dimension variable and the optional argument atts is a Dict holding pairs of attribute names and values. Setting unlimited=true creates an unlimited dimension.","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"After defining the dimensions, you can create NcVar objects with","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NcVar(varname , dimlist; atts=Dict{Any,Any}(), t=Float64, compress=-1)","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"Here varname is the name of the variable, dimlist an array of type NcDim holding the dimensions associated to the variable, varattributes is a Dict holding pairs of attribute names and values. t is the data type that should be used for storing the variable.  You can either specify a Julia type (Int16, Int32, Float32, Float64) which will be translated to (NC_SHORT, NC_INT, NC_FLOAT, NC_DOUBLE) or directly specify one of the latter list. You can also set the compression level of the variable by setting compress to a number in the range 1..9 This has only an effect in NetCDF4 files.","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"Having defined the variables, the NetCDF file can be created:","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NetCDF.create(filename, varlist, gatts=Dict{Any,Any}(),mode=NC_NETCDF4)","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"Here, filename is the name of the file to be created and varlist an array of NcVar holding the variables that should appear in the file. In the optional argument gatts you can specify a Dict containing global attributes and mode is the file type you want to create(NC_NETCDF4, NC_CLASSIC_MODEL or NC_64BIT_OFFSET).","category":"page"},{"location":"intermediate/#Miscellaneous","page":"Medium-level interface","title":"Miscellaneous","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"Note that as of version 0.9 there is no need to close the NetCDF files anymore. This will be done through finalizers.","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"If you just want to synchronize your changes to the disk, run","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NetCDF.sync(nc)","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"where nc is a NetCDF file handle.","category":"page"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"As an alternative, NetCDF.open and NetCDF.create provide a method accepting a function as its first argument.","category":"page"},{"location":"intermediate/#Interface-for-creating-files","page":"Medium-level interface","title":"Interface for creating files","text":"","category":"section"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NcDim","category":"page"},{"location":"intermediate/#NetCDF.NcDim","page":"Medium-level interface","title":"NetCDF.NcDim","text":"NcDim\n\nRepresents a NetCDF dimension of name name optionally holding the dimension values.\n\n\n\n\n\n","category":"type"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NcVar","category":"page"},{"location":"intermediate/#NetCDF.NcVar","page":"Medium-level interface","title":"NetCDF.NcVar","text":"NcVar\n\nNcVar{T,N,M} represents a NetCDF variable. It is a subtype of AbstractArray{T,N}, so normal indexing using [] will work for reading and writing data to and from a NetCDF file. NcVar objects are returned by NetCDF.open, by indexing an NcFile object (e.g. myfile[\"temperature\"]) or, when creating a new file, by its constructor. The type parameter M denotes the NetCDF data type of the variable, which may or may not correspond to the Julia Data Type.\n\n\n\n\n\n","category":"type"},{"location":"intermediate/","page":"Medium-level interface","title":"Medium-level interface","text":"NetCDF.create","category":"page"},{"location":"intermediate/#NetCDF.create","page":"Medium-level interface","title":"NetCDF.create","text":"NetCDF.create(name::String,varlist::Array{NcVar};gatts::Dict=Dict{Any,Any}(),mode::UInt16=NC_NETCDF4)\n\nCreates a new NetCDF file. Here, name  is the name of the file to be created and varlist an array of NcVar holding the variables that should appear in the file.\n\nKeyword arguments\n\ngatts a Dict containing global attributes of the NetCDF file\nmode NetCDF file type (NC_NETCDF4, NC_CLASSIC_MODEL or NC_64BIT_OFFSET), defaults to NC_NETCDF4\n\n\n\n\n\nNetCDF.create(f::Function, args...;kwargs...)\n\nCreates a NetCDF file, applies the function f on the resulting file or variable handle and properly closes the file after usage. This is convenient to use together with the do block syntax, for example:\n\nd = NcDim(\"time\",1:10) v = NcVar(\"obs\",d); NetCDF.create(\"newfile.nc\",v) do nc   nc[\"obs\"][:] = rand(10) end\n\n\n\n\n\n","category":"function"},{"location":"quickstart/#Quickstart","page":"Quickstart","title":"Quickstart","text":"","category":"section"},{"location":"quickstart/#Reading-a-file","page":"Quickstart","title":"Reading a file","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"The most common task is probably to just read a NetCDF file into memory. This is done with:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"ncread(filename, varname)","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"This reads the whole variable into memory and returns it as a Julia array. To read only a slice of a NetCDF file, there are optional start and count keyword arguments, where on can specify the starting index and count along each dimension.","category":"page"},{"location":"quickstart/#A-more-advanced-example","page":"Quickstart","title":"A more advanced example","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"In this example we show how to create a NetCDF file from scratch, write some data to it and read it back in afterwards. First of all we create an array with top-of the atmosphere radiation data:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"using NetCDF\ninclude(joinpath(dirname(pathof(NetCDF)), \"../examples/toa.jl\"))\n\n# Define longitudes and latitudes, day and timesteps\nlat = collect(-89.5:89.5)\nlon = collect(-179.5:179.5)\nday = 1\ntim = collect(0:23)\n\n# Create radiation array\nrad = [g_pot(x2,x1,day,x3) for x1=lon, x2=lat, x3=tim];","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"The resulting array is a 3-dimensional array with dimensions lon-lat-time, resembling approximately the hourly top of atmosphere radiation on January 1st. For documentation purposes we want to add atributes to the variable as well as the dimensions. Throughout this package, attributes are represented Dict{String}s:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"varatts = Dict(\"longname\" => \"Radiation at the top of the atmosphere\",\n          \"units\"    => \"W/m^2\")\nlonatts = Dict(\"longname\" => \"Longitude\",\n          \"units\"    => \"degrees east\")\nlatatts = Dict(\"longname\" => \"Latitude\",\n          \"units\"    => \"degrees north\")\ntimatts = Dict(\"longname\" => \"Time\",\n          \"units\"    => \"hours since 01-01-2000 00:00:00\");","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Now we have all the meta-information ready to create the actual file:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"fn = joinpath(tempdir(),\"radiation.nc\")\nisfile(fn) && rm(fn)\nnccreate(fn,\"rad\",\"lon\",lon,lonatts,\"lat\",lat,latatts,\"time\",tim,timatts,atts=varatts);\nnothing # hide","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Once the file is created we can write the actual data to it:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"ncwrite(rad,fn,\"rad\");","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Now we assume we just retrieved this radiation NetCDF file and want to get some information about it. This is done using ncinfo:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"ncinfo(fn)","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Here we learn the most important information about the file, which variables it contains, the variable dimensions and their attributes. We decide to read the radiation variable:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"x=ncread(fn,\"rad\")\nsize(x)","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"This reads the whole array at once. If we only want to read a certain part of the variable, for example if we only want to plot the time series at a certain location, we can use the start and count keywords:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"ts = ncread(fn,\"rad\",start=[180,45,1], count=[1,1,-1])","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"In order to correctly label the time steps we retrieve the time information from the file:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"using Dates\ntvec = DateTime(2001,1,1) + Hour.(ncread(fn,\"time\"))","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Now we can generate the plot:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"plot(tvec,ts)","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Another example would be to generate a heatmap plot of the solar radiation at 12am UTC:","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"lons = ncread(fn,\"lon\")\nlats = ncread(fn,\"lat\")\nm    = ncread(fn,\"rad\",start=[1,1,12],count=[-1,-1,1])\nplot(heatmap(x=lons,y=lats,z=m))","category":"page"},{"location":"highlevel/#High-level-interface","page":"High-level interface","title":"High-level interface","text":"","category":"section"},{"location":"highlevel/#Getting-information","page":"High-level interface","title":"Getting information","text":"","category":"section"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"ncinfo","category":"page"},{"location":"highlevel/#NetCDF.ncinfo","page":"High-level interface","title":"NetCDF.ncinfo","text":"ncinfo()\n\nprints information on the variables, dimension and attributes conatained in the file\n\n\n\n\n\n","category":"function"},{"location":"highlevel/#Reading-data","page":"High-level interface","title":"Reading data","text":"","category":"section"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"ncread","category":"page"},{"location":"highlevel/#NetCDF.ncread","page":"High-level interface","title":"NetCDF.ncread","text":"ncread(filename, varname)\n\nreads the values of the variable varname from file filename and returns the values in an array.\n\nKeyword arguments\n\nstart Vector of length ndim(v) setting the starting index for each dimension\ncount Vector of length ndim(v) setting the count of values to be read along each dimension. The value -1 is treated as a special case to read all values from this dimension\n\nExample\n\nTo read the second slice of a 3D NetCDF variable one can write:\n\nncread(\"filename\",\"varname\", start=[1,1,2], count = [-1,-1,1])\n\n\n\n\n\n","category":"function"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"ncread!","category":"page"},{"location":"highlevel/#NetCDF.ncread!","page":"High-level interface","title":"NetCDF.ncread!","text":"ncread!(filename, varname, d)\n\nreads the values of the variable varname from file filename and writes the results to the pre-allocated array d\n\nKeyword arguments\n\nstart Vector of length ndim(v) setting the starting index for each dimension\ncount Vector of length ndim(v) setting the count of values to be read along each dimension. The value -1 is treated as a special case to read all values from this dimension\n\nExample\n\nTo read the second slice of a 3D NetCDF variable one can write:\n\nd = zeros(10,10,1)\nncread!(\"filename\",\"varname\", d, start=[1,1,2], count = [-1,-1,1])\n\n\n\n\n\n","category":"function"},{"location":"highlevel/#Writing-data","page":"High-level interface","title":"Writing data","text":"","category":"section"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"ncwrite","category":"page"},{"location":"highlevel/#NetCDF.ncwrite","page":"High-level interface","title":"NetCDF.ncwrite","text":"ncwrite(x::Array,fil::AbstractString,vname::AbstractString)\n\nWrites the array x to the file fil and variable vname.\n\nKeyword arguments\n\nstart Vector of length ndim(v) setting the starting index for writing for each dimension\ncount Vector of length ndim(v) setting the count of values to be written along each dimension. The value -1 is treated as a special case to write all values from this dimension. This is usually inferred by the given array size.\n\n\n\n\n\n","category":"function"},{"location":"highlevel/#Reading-attributes","page":"High-level interface","title":"Reading attributes","text":"","category":"section"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"ncgetatt","category":"page"},{"location":"highlevel/#NetCDF.ncgetatt","page":"High-level interface","title":"NetCDF.ncgetatt","text":"ncgetatt(filename, varname, attname)\n\nThis reads a NetCDF attribute attname from the specified file and variable. To read global attributes, set varname to Global.\n\n\n\n\n\n","category":"function"},{"location":"highlevel/#Writing-attributes","page":"High-level interface","title":"Writing attributes","text":"","category":"section"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"ncputatt","category":"page"},{"location":"highlevel/#NetCDF.ncputatt","page":"High-level interface","title":"NetCDF.ncputatt","text":"ncputatt(nc::String,varname::String,atts::Dict)\n\nWrites the attributes defined in atts to the variable varname for the given NetCDF file name nc. Existing attributes are overwritten. If varname is not a valid variable name, a global attribute will be written.\n\n\n\n\n\n","category":"function"},{"location":"highlevel/#Creating-files","page":"High-level interface","title":"Creating files","text":"","category":"section"},{"location":"highlevel/","page":"High-level interface","title":"High-level interface","text":"nccreate","category":"page"},{"location":"highlevel/#NetCDF.nccreate","page":"High-level interface","title":"NetCDF.nccreate","text":"nccreate (filename, varname, dimensions ...)\n\nCreate a variable in an existing NetCDF file or generates a new file. filename and varname are strings. After that follows a list of dimensions. Each dimension entry starts with a dimension name (a String), and may be followed by a dimension length, an array with dimension values or a Dict containing dimension attributes. Then the next dimension is entered and so on. Have a look at examples/high.jl for an example use.\n\nKeyword arguments\n\natts Dict of attribute names and values to be assigned to the variable created\ngatts Dict of attribute names and values to be written as global attributes\ncompress Integer [0..9] setting the compression level of the file, only valid if mode=NC_NETCDF4\nt variable type, currently supported types are: const NC_BYTE, NC_CHAR, NC_SHORT, NC_INT, NC_FLOAT, NC_LONG, NC_DOUBLE\nmode file creation mode, only valid when new file is created, choose one of: NC_NETCDF4, NC_CLASSIC_MODEL, NC_64BIT_OFFSET\n\n\n\n\n\n","category":"function"},{"location":"#NetCDF.jl","page":"Home","title":"NetCDF.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Reading and writing NetCDF files in Julia","category":"page"},{"location":"#Package-features","page":"Home","title":"Package features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"High-level (MATLAB-like), low-level (C-like) and array-based access to NetCDF files.","category":"page"},{"location":"#Manual-Outline","page":"Home","title":"Manual Outline","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"intro.md\",\n    \"quickstart.md\",\n    \"highlevel.md\",\n    \"intermediate.md\",\n    \"strings.md\"\n]\nDepth = 1","category":"page"},{"location":"#Acknowledgements","page":"Home","title":"Acknowledgements","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Thanks to everyone who contributed to the package with pull requests, especially to Martijn Visser for creating the new generated C wrapper.","category":"page"},{"location":"#Index","page":"Home","title":"Index","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"}]
}
